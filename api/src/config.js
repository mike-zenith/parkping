const API_PORT = process.env.PORT || 3000;
const API_HOST = process.env.HOST || "api";
const TP_USERNAME = process.env.TP_USERNAME || "admin";
const TP_PASSWORD = process.env.TP_PASSWORD || "admin";

module.exports = {
    url: {
        approve: "http://" + API_HOST + ":" + API_PORT + "/spot/:spotId/approve"
    },
    pubnub: {
        ssl: true,
        publish_key: process.env.PUBNUB_PUB_KEY || "demo",
        subscribe_key: process.env.PUBNUB_SUB_KEY || "demo"
    },
    test: process.env.API_ENV === "test",
    targetprocess: {
        credentials: {
            domain: process.env.TP_DOMAIN || "localhost",
            token:  new Buffer(TP_USERNAME+':'+TP_PASSWORD).toString('base64'),
            protocol: "https"
        },
        template: {
            name: "Unapproved spot",
            description: "Unapproved spot has been added by {{username}}. Please check it @ {{mapurl}} !  Approve it: {{approveurl}} !"
        },
        project: {
            Id: 386
        }
    },
    api: {
        port: API_PORT
    },
    mysql: {
        host: process.env.MYSQL_PORT_3306_TCP_ADDR || "localhost",
        port: process.env.MYSQL_PORT_3306_TCP_PORT || 3306,
        username: process.env.MYSQL_ENV_MYSQL_USER || "root",
        password: process.env.MYSQL_ENV_MYSQL_PASSWORD || "rootroot",
        database: process.env.MYSQL_ENV_MYSQL_DATABASE || "parkping"
    }
};
