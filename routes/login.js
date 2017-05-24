const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("./admin").bcrypt;
const pool = require('../index');


const loginForm = path.resolve(__dirname, "../client/admin/login.html");

router.get("/", function (req, resp) {
    resp.sendFile(loginForm);
});

router.post("/", function (req, resp){

    console.log(req.body);
        let dbQuery = "SELECT * FROM user_login WHERE username = $1";
        pool.query(dbQuery, [req.body.username], function (err, result) {
            if (err) {console.log(err)}

            console.log(result.rows[0]);

            if (result.rows[0] !== undefined) {
                if (result.rows.length > 0) {
                    bcrypt.compare(req.body.password, result.rows[0].password, function (err, isMatch) {
                        if (isMatch) {
                            req.session.user_id = result.rows[0].type_id;
                            req.session.SPK_user = result.rows[0].id;
                            resp.send({
                                status: "success",
                                message: "login successfully",
                                type: req.session.user_id,
                                user: req.session.id
                            });
                        } else {
                            resp.send({status: "failed", message: "incorrect login"});
                        }
                        //resp.send({status:"success"});
                    });

                    //req.session.user = result.rows[0];
                    //console.log(req.session.user.password);
                    //resp.send({status:"success", user:req.session.user});
                } else {
                    resp.send({status: "fail"});
                }
            }
        });
});

module.exports = router;