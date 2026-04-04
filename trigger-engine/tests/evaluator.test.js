/**
 * trigger-engine/tests/evaluator.test.js
 * Formal tests for the Trigger Engine Evaluation Logic
 */
const { evaluate, buildIdempotencyKey } = require('../../shared/evaluator/evaluator');
const RiskScore = require('../../shared/models/RiskScore');
const FraudFlag = require('../../shared/models/FraudFlag');
const Payout = require('../../shared/models/Payout');
const User = require('../../shared/models/User');

jest.mock('../../shared/models/RiskScore');
jest.mock('../../shared/models/FraudFlag');
jest.mock('../../shared/models/Payout');
jest.mock('../../shared/models/User');

describe('Trigger Engine Evaluator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should identify users eligible for payout (Risk >= 0.5)', async () => {
        User.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ _id: 'user1' }])
            })
        });

        RiskScore.findOne.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ score: 0.8 })
            })
        });

        FraudFlag.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        Payout.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        const results = await evaluate();
        expect(results).toHaveLength(1);
        expect(results[0].userId).toBe('user1');
        expect(results[0].riskScore).toBe(0.8);
    });

    test('should skip users with low risk score', async () => {
        User.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ _id: 'user2' }])
            })
        });

        RiskScore.findOne.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ score: 0.2 })
            })
        });

        const results = await evaluate();
        expect(results).toHaveLength(0);
    });

    test('should skip users with active fraud flags', async () => {
        User.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ _id: 'user3' }])
            })
        });

        RiskScore.findOne.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ score: 0.9 })
            })
        });

        FraudFlag.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ status: 'open' })
        });

        const results = await evaluate();
        expect(results).toHaveLength(0);
    });

    test('should skip users in cooldown period', async () => {
        User.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ _id: 'user4' }])
            })
        });

        RiskScore.findOne.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ score: 0.7 })
            })
        });

        FraudFlag.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        Payout.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ createdAt: new Date() })
        });

        const results = await evaluate();
        expect(results).toHaveLength(0);
    });
});
