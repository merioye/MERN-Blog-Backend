const router = require('express').Router();
const auth = require('../../middlewares/auth');



router.get('/logout', auth, (req, res)=>{
    res.cookie('accessToken', null, {
        httpOnly:true,
        expires: new Date(Date.now())
    });

    res.status(200).json({
        message: 'Logged out'
    });
});


module.exports = router;