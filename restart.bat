@echo off
echo 🔄 Перезапуск контейнеров...
docker compose down
docker compose up -d --build
echo ✅ Готово!
docker compose logs -f backend