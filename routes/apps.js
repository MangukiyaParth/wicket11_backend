const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middlewere/fetchuser');
var dbUtils = require('../helper/index').Db;
const multer = require('multer');
const upload = multer();

// Get loggedin user detail 
router.post('/', fetchuser, upload.none(), [body('name', 'Enter a name').exists()], async (req, res)=>{

    // Validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 0, errors: errors.array() });
    }
    try{
        const { playstore, adx, name, code, package, url, remark, status } = req.body;
        let appData = [];
        appData['playstore'] = playstore;
        appData['adx'] = adx;
        appData['name'] = name;
        appData['code'] = code;
        appData['package'] = package;
        appData['url'] = url;
        appData['remark'] = remark;
        appData['status'] = parseInt(status);
        await dbUtils.insert('tbl_app', appData);
        res.json({status: 1, message: "App added successfully."});
    } catch (error){
        res.status(500).json({ status:0, error: "Internal server error", error_data: error});
    }
});

// Update a playstore 
router.put('/', fetchuser, upload.none(), [], async (req, res)=>{
    const { playstore, adx, name, code, package, url, remark, status, id } = req.body;
    try {
        let appData = [];
        appData['playstore'] = playstore;
        appData['adx'] = adx;
        appData['name'] = name;
        appData['code'] = code;
        appData['package'] = package;
        appData['url'] = url;
        appData['remark'] = remark;
        appData['status'] = parseInt(status);
        appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
        dbUtils.update('tbl_app',appData, "id='"+id+"'");

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// Delete a app
router.delete('/', fetchuser, upload.none(), [], async (req, res)=>{
    let status = 0;
    const {id} = req.body;
    try{
        // Check Song Exist
        const leave = await dbUtils.execute(`SELECT id FROM tbl_app WHERE id = '${id}'`);
        if(leave && id && id != "" && leave.length > 0) {
            await dbUtils.delete('tbl_app',`id = '${id}'`);
            status=1;
        }
        else {
            {return res.status(400).json({ status:status, errors: "Not Found!" });}
        }
        
        res.json({status: status, message: "app Deleted Successfully"});

    } catch (error){
        res.status(500).json({ status:status, error: "Internal server error"});
    }
});

// Get app
router.get('/', fetchuser, upload.none(), [], async (req, res)=>{
    let { search, page, page_size, currentStatus, sortField, sortDirection } = req.query;
	const ITEMS_PER_PAGE = page_size;
    page = parseInt(page);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let status = 0;
    let orderBy = "entry_date DESC";
    if(sortField != ""){
        orderBy = sortField + " " + ((sortDirection != "") ? sortDirection : 'asc');
    }
    try{
        const app = await dbUtils.execute(`SELECT *
            FROM tbl_app
            WHERE status = '${currentStatus}' AND name LIKE '${`%${search}%`}'
            ORDER BY ${orderBy}
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`);
        if(!app){
            return res.status(400).json({status:0, error: "Data not found."})
        }
        else 
        {
            const app_total = await dbUtils.execute_single(`SELECT COUNT(id)
            FROM tbl_app
            WHERE name LIKE '${`%${search}%`}'`);
            res.json({ status: 1, res_data: app, total: app_total['count']});
        }

    } catch (error){
        res.status(500).json({ status:status, error: "Internal server error"});
    }
});

router.get('/appbyid', fetchuser, upload.none(), [], async (req, res)=>{
	let { id } = req.query;
    try{
        const app = await dbUtils.execute_single(`SELECT * FROM tbl_app WHERE id = '${id}'`);
        if(!app){
            return res.status(400).json({status:0, error: "Data not found."})
        }
        else 
        {
            res.json({ status: 1, res_data: app});
        }
    } catch (error){
        res.status(500).json({ status:status, error: "Internal server error"});
    }
});

/*============================================================================================================
                                                Settings
============================================================================================================*/

// Update a google 
router.post('/google', fetchuser, upload.none(), [], async (req, res)=>{
    const { g1_percentage, g2_percentage, g3_percentage, g1_account, g2_account, g3_account, g1_banner, g2_banner, g3_banner, g1_inter, g2_inter, g3_inter, g1_native, g2_native, g3_native, g1_native2, g2_native2, g3_native2, g1_appopen, g2_appopen, g3_appopen, g1_appid, g2_appid, g3_appid, type, id } = req.body;
    try {
        let appData = [];
        appData['g1_percentage'] = g1_percentage;
        appData['g2_percentage'] = g2_percentage;
        appData['g3_percentage'] = g3_percentage;
        appData['g1_account_name'] = g1_account;
        appData['g2_account_name'] = g2_account;
        appData['g3_account_name'] = g3_account;
        appData['g1_banner'] = g1_banner;
        appData['g2_banner'] = g2_banner;
        appData['g3_banner'] = g3_banner;
        appData['g1_inter'] = g1_inter;
        appData['g2_inter'] = g2_inter;
        appData['g3_inter'] = g3_inter;
        appData['g1_native'] = g1_native;
        appData['g2_native'] = g2_native;
        appData['g3_native'] = g3_native;
        appData['g1_native2'] = g1_native2;
        appData['g2_native2'] = g2_native2;
        appData['g3_native2'] = g3_native2;
        appData['g1_appopen'] = g1_appopen;
        appData['g2_appopen'] = g2_appopen;
        appData['g3_appopen'] = g3_appopen;
        appData['g1_appid'] = g1_appid;
        appData['g2_appid'] = g2_appid;
        appData['g3_appid'] = g3_appid;

        const app = await dbUtils.execute_single(`SELECT * FROM tbl_apps_settings WHERE app_id = '${id}' AND type='${type}'`);
        if(!app){
            console.log(1);
            appData['app_id'] = id;
            appData['type'] = type;
            dbUtils.insert('tbl_apps_settings',appData);
        }
        else 
        {
            console.log(2);
            appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
            dbUtils.update('tbl_apps_settings',appData, "id='"+app.id+"'");
        }

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// get Google Data 
router.get('/google', fetchuser, upload.none(), [], async (req, res)=>{
    const { type, id } = req.query;
    try {
        const app = await dbUtils.execute_single(`SELECT * FROM tbl_apps_settings WHERE app_id = '${id}' AND type='${type}'`);
        if(!app){
            return res.status(400).json({status:0, error: "Data not found."})
        }
        else 
        {
            res.json({ status: 1, res_data: app});
        }
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});
module.exports = router;