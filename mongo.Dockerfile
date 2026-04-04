FROM mongo:7.0

# Ensure the database data is persisted correctly on Render's disk
# Default mount path in render.yaml will be /data/db
VOLUME /data/db

EXPOSE 27017

CMD ["mongod", "--bind_ip_all"]
