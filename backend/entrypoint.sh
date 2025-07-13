#!/bin/sh

set -e

echo "Waiting for the database..."

# Wait until DB port is open instead of using db pull
until nc -z db 5432; do
  echo "Database not ready. Retrying in 2s..."
  sleep 2
done

echo "...Running migrations..."
npx prisma migrate deploy

echo "...Running seed script..."
npx prisma db seed

echo "...Starting server..."
npm run server