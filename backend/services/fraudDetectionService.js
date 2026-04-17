const FraudFlag = require('../../shared/models/FraudFlag');
const { calculateDistanceKM } = require('../utils/geo');

/**
 * Detects impossible travel between consecutive location pings.
 * 
 * @param {ObjectId} userId 
 * @param {Object} currentData - { location: {lat, lng}, timestamp: Date }
 * @param {Object} previousData - { location: {lat, lng}, timestamp: Date }
 * @returns {Boolean} true if impossible travel detected, else false
 */
exports.detectImpossibleTravel = async (userId, currentData, previousData) => {
    if (!previousData || !previousData.location || !currentData || !currentData.location) return false;

    const distanceKM = calculateDistanceKM(
        previousData.location.lat, previousData.location.lng,
        currentData.location.lat, currentData.location.lng
    );

    // Guard against GPS jitter: Less than 0.1km movement won't trigger speed traps
    if (distanceKM < 0.1) return false;

    const timeDiffMs = currentData.timestamp.getTime() - previousData.timestamp.getTime();
    
    // Distant movement with negative or zero time diff is physically impossible
    if (timeDiffMs <= 0) {
        await FraudFlag.create({
            userId,
            score: 0.99,
            reason: `Impossible movement detected: ${distanceKM.toFixed(2)}km apart with no time elapsed.`,
            status: 'open'
        });
        console.log(`[FRAUD] Impossible movement (zero time) caught for ${userId}`);
        return true;
    }

    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    const speedKmH = distanceKM / timeDiffHours;

    // Impossible speed threshold (>100 km/h) context within gig-working scenarios
    if (speedKmH > 100) {
        await FraudFlag.create({
            userId,
            score: 0.99,
            reason: `Impossible movement detected: ${distanceKM.toFixed(2)}km apart within ${(timeDiffMs / 60000).toFixed(2)} minutes (${speedKmH.toFixed(2)} km/h)`,
            status: 'open'
        });
        console.log(`[FRAUD] Impossible movement caught for ${userId}`);
        return true;
    }

    return false;
};
