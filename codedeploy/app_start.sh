#give permission for everything in the app directory
sudo chmod -R 777 /home/ubuntu/app

cd /home/ubuntu/app/server
sudo yarn install -f
# sudo npm run test

pm2 kill
pm2 start /home/ubuntu/app/server/dist/main.js
pm2 start 0