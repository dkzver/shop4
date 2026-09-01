@echo off
echo 🚀 Запуск контейнеров...
docker compose up -d
echo ✅ Готово!
docker compose logs -f backend