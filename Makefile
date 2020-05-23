setup: 
	brew tap mongodb/brew
	brew install mongodb-community@4.2
	#the configuration file (/usr/local/etc/mongod.conf)
	#the log directory path (/usr/local/var/log/mongodb)
	#the data directory path (/usr/local/var/mongodb)

server: db
	npm run start-dev

server-stop:
	brew services stop mongodb-community@4.2

db:
	brew services start mongodb-community@4.2
	ps aux | grep -v grep | grep mongod

mongo:
	mongo
