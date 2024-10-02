// backend/firebaseAdmin.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your credentials
admin.initializeApp({
    credential: admin.credential.cert(
        {
            "type": "service_account",
            "project_id": "prepsmart-d6b2f",
            "private_key_id": "b380f3d9c936b6b3e268e8cf30d96770156e9075",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFUaOZ+eh3M9Rk\npZjwqx1SiEZoYx4+BoH0r7/3s4zRUGJgASbOymLLdsqND46RbvJ5H+jqPV+OxkzJ\nU0Dtwwi2XB9AYzHOUxJAbJk/JAdRtI8vzrVDIaLWXDH2r++mwDFZqfSOyoqi4fQN\nWC3Zx+nw/T5S2T87ct0aqpf8lseqWUPx13r6EBgtSFTYBc3gKKeWL63vmOGGV6s7\nGGhVLZxaimqdxu3Hb43rVV0AmSo1AL4g5+ePvLNdZNJzM6hlxRnlD+6O9wzF3k8M\nmXCG+WnFwVAxLKgG1cZZOl1qwOz0wl3/KKDvj9ch2LzLtiTv5XMq7/bDeTh/UkQ5\nD2mtAkVrAgMBAAECggEAEmYlajMqYQsdL/FdDHv4NPzuC8fKRyBWN9m3fcJpTA9B\nzQ/ubXPjuHMwOe0MbzU4OOEn18e3RFnrSQ6RTFpWUqLOazOUrleCqS03MPMMF6tN\neri8oDDfvTtFkWogX50mPOUjH7l1KfEFz8S8KcWBY+5JRHJregCg616i43Ov1Itq\nYTpLcAXDmovV1dFeTcrkBGu+T6Ze2r1AK5hjyhyBvgOzRbzzd++xpt+Djk2gypXj\nJPu/3w7MhN3VEmQt0d4dBwzcoJlV70v797LuPkwFKBxNQRKHMy6hzFTRcAhTJz9Q\nEPbV1bg7SPRAIbyEGFoFe+ce8Y0McY1CfTBkxRzrUQKBgQDodauo9NEUhcGGGc/A\n0BGgw8CBnSp/0eT/mmOoDd4r4b265pM+rOBdH3aoFGFLyVg/bvGDMWa1Yq1wnInj\n9iVIqmlioGh14AM2TJAbQZfrTOY53g1fgHl9si125jq20EhfHhooCiXu7cZTEcvq\ndAXbzLvNZuvmfzhonKLq4cLx4wKBgQDZTPkPzCOst1ffeOntw1YU4nJo9vP+tdNx\np/jEXOn73ZKHWwfmB0hJByPEo8ejF831FiFA2jkwOLOH3eZgL/OlnO7decO6RRQ5\n0OGUj08ANILj1F371VVUopWE1SJAC/4GaHRceGimbPrzNxoeIPauM7392Y6eguY0\nJraPvSSU2QKBgGYxTMzTC5N1FdWpRT7jecxuIhQZDtTwZjbEHamEpzYtYGZo9TRp\ndZ0atuQ/SWKy2jvQvxXIwvlcrxjBiJER5eQjHn9AO4wOdfsJ/5Qr6uiDfvbTmpdw\neHh8uyX5Iri5qgc+yYruoyx9lWFxgm7IoMa3I5yx8WT8asT6j1io9TW3AoGAJOdX\nnQE0Rc7VU5R7Ve/InL9gYscd5PIIONMoAmEtM6MLkYU6MCyocA6QWoLeEqqmRas+\ndn8ZG0Fl6/sZdtht7oBaaK6XOPkmWDNLPCmiZwyD9iFI3M38MeVysx5nNK1UtM3k\nhRfF3g3ACLIg82Dxw9/xsjzSZcUhR1YTxxF+NvECgYEAyVvkD+NRl30e8kWZBa41\nzvsy6S2TLlaZV00w/dpe4yU9Frx2VUiHqqc0pvYOoigjmzxVB2qYDFsdoZzplsrI\naXWS+g9fC07wPqXf2v18T3TnH7xPXLYin49K0f0Iqs6nFgHbQW71Ue2kirBohjpZ\nKaxI1Z/Ro/NN7TruKQcUR7Q=\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-s69vf@prepsmart-d6b2f.iam.gserviceaccount.com",
            "client_id": "102124708854689205942",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s69vf%40prepsmart-d6b2f.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        })
});

module.exports = admin;

