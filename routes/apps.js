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
            appData['app_id'] = id;
            appData['type'] = type;
            dbUtils.insert('tbl_apps_settings',appData);
        }
        else 
        {
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

// Update a adsetting 
router.post('/adsetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { app_color, app_background_color, native_loading, bottom_banner, all_screen_native, list_native, list_native_cnt, exit_dialoge_native, native_btn, native_btn_text, native_background_color, native_text_color, native_button_background_color, native_button_text_color, alternate_with_appopen, inter_loading, inter_interval, back_click_inter, app_open_loading, splash_ads, app_open, is_bifurcate, type, id } = req.body;
    try {
        let appData = [];
        appData['app_color'] = app_color;
        appData['app_background_color'] = app_background_color;
        appData['native_loading'] = native_loading;
        appData['bottom_banner'] = bottom_banner;
        appData['all_screen_native'] = all_screen_native;
        appData['list_native'] = list_native;
        appData['list_native_cnt'] = list_native_cnt;
        appData['exit_dialoge_native'] = exit_dialoge_native;
        appData['native_btn'] = native_btn;
        appData['native_btn_text'] = native_btn_text;
        appData['native_background_color'] = native_background_color;
        appData['native_text_color'] = native_text_color;
        appData['native_button_background_color'] = native_button_background_color;
        appData['native_button_text_color'] = native_button_text_color;
        appData['alternate_with_appopen'] = alternate_with_appopen;
        appData['inter_loading'] = inter_loading;
        appData['inter_interval'] = inter_interval;
        appData['back_click_inter'] = back_click_inter;
        appData['app_open_loading'] = app_open_loading;
        appData['splash_ads'] = splash_ads;
        appData['app_open'] = app_open;
        const app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = ${is_bifurcate}`);
        if(!app){
            appData['app_id'] = id;
            appData['type'] = type;
            appData['is_bifurcate'] = is_bifurcate;
            dbUtils.insert('tbl_app_ad_settings',appData);
        }
        else 
        {
            appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
            dbUtils.update('tbl_app_ad_settings',appData, "id='"+app.id+"'");
        }

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// get adsetting Data 
router.get('/adsetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { type, id, is_bifurcate, bifurcate_id } = req.query;
    try {
        let app;
        if(is_bifurcate){
            app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = 0`);
        }
        else {
            app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE id = '${bifurcate_id}'`);
        }
        
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

// Update a othersetting 
router.post('/othersetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { all_ads, fullscreen, adblock_version, continue_screen, lets_start_screen, age_screen, next_screen, next_inner_screen, contact_screen, start_screen, real_casting_flow, app_stop, additional_fields, is_bifurcate, type, id } = req.body;
    try {
        let appData = [];
        appData['all_ads'] = all_ads;
        appData['fullscreen'] = fullscreen;
        appData['adblock_version'] = adblock_version;
        appData['continue_screen'] = continue_screen;
        appData['lets_start_screen'] = lets_start_screen;
        appData['age_screen'] = age_screen;
        appData['next_screen'] = next_screen;
        appData['next_inner_screen'] = next_inner_screen;
        appData['contact_screen'] = contact_screen;
        appData['start_screen'] = start_screen;
        appData['real_casting_flow'] = real_casting_flow;
        appData['app_stop'] = app_stop;
        appData['additional_fields'] = additional_fields;

        const app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = ${is_bifurcate}`);
        if(!app){
            appData['app_id'] = id;
            appData['type'] = type;
            appData['is_bifurcate'] = is_bifurcate;
            dbUtils.insert('tbl_app_ad_settings',appData);
        }
        else 
        {
            appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
            dbUtils.update('tbl_app_ad_settings',appData, "id='"+app.id+"'");
        }

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// get othersetting Data 
router.get('/othersetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { type, id } = req.query;
    try {
        let app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = 0`);
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

// Update a vpnsetting 
router.post('/vpnsetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { vpn, vpn_dialog, vpn_dialog_open, vpn_country, vpn_url, vpn_carrier_id, is_bifurcate, type, id } = req.body;
    try {
        let appData = [];
        appData['vpn'] = vpn;
        appData['vpn_dialog'] = vpn_dialog;
        appData['vpn_dialog_open'] = vpn_dialog_open;
        appData['vpn_country'] = vpn_country;
        appData['vpn_url'] = vpn_url;
        appData['vpn_carrier_id'] = vpn_carrier_id;

        const app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = ${is_bifurcate}`);
        if(!app){
            appData['app_id'] = id;
            appData['type'] = type;
            appData['is_bifurcate'] = is_bifurcate;
            dbUtils.insert('tbl_app_ad_settings',appData);
        }
        else 
        {
            appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
            dbUtils.update('tbl_app_ad_settings',appData, "id='"+app.id+"'");
        }

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// get vpnsetting Data 
router.get('/vpnsetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { type, id } = req.query;
    try {
        let app = await dbUtils.execute_single(`SELECT * FROM tbl_app_ad_settings WHERE app_id = '${id}' AND type='${type}' AND is_bifurcate = 0`);
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

// Update a appremovesetting 
router.post('/appremovesetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { app_remove_flag, app_version, app_remove_title, app_remove_description, app_remove_url, app_remove_button_name, app_remove_skip_button_name, type, id } = req.body;
    try {
        let appData = [];
        appData['app_remove_flag'] = app_remove_flag;
        appData['app_version'] = app_version;
        appData['app_remove_title'] = app_remove_title;
        appData['app_remove_description'] = app_remove_description;
        appData['app_remove_url'] = app_remove_url;
        appData['app_remove_button_name'] = app_remove_button_name;
        appData['app_remove_skip_button_name'] = app_remove_skip_button_name;
        
        const app = await dbUtils.execute_single(`SELECT * FROM tbl_apps_settings WHERE app_id = '${id}' AND type='${type}'`);
        if(!app){
            appData['app_id'] = id;
            appData['type'] = type;
            dbUtils.insert('tbl_apps_settings',appData);
        }
        else 
        {
            appData['update_date'] = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
            dbUtils.update('tbl_apps_settings',appData, "id='"+app.id+"'");
        }

        res.json({status:1, message: "User updated successfully."});
    } catch (error) {
        res.status(500).json({ status: 0, error: "Internal server error"});
    }
});

// get appremovesetting Data 
router.get('/appremovesetting', fetchuser, upload.none(), [], async (req, res)=>{
    const { type, id } = req.query;
    try {
        let app = await dbUtils.execute_single(`SELECT app_remove_flag, app_version, app_remove_title, app_remove_description, app_remove_url, app_remove_button_name, app_remove_skip_button_name FROM tbl_apps_settings WHERE app_id = '${id}' AND type='${type}'`);
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