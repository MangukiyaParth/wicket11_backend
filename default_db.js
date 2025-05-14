const pool = require('./db');
const bcrypt = require('bcrypt');

async function seedUsers() {
    try {
        // Create the "users" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_users (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                usertype UUID NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email TEXT NOT NULL UNIQUE,
                username TEXT NULL UNIQUE,
                password TEXT NULL,
                entry_uid UUID NULL,
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log(`Created "tbl_users" table`);

        const hashedPassword = await bcrypt.hash('admin', 10);
        pool.query(`INSERT INTO tbl_users (usertype, firstname, lastname, name, email, username, password)
            VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', 'Admin', '', 'Admin', 'admin@gmail.com', 'admin@gmail.com', '${hashedPassword}');`);

        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}

async function seedUserTypes() {
    try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        // Create the "users" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_user_types (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                usertype VARCHAR(255) NOT NULL,
                isaccount BOOLEAN DEFAULT false
            );
        `);

        console.log(`Created "tbl_user_types" table`);

        pool.query(`INSERT INTO tbl_user_types (id, usertype) VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', 'Admin');`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding user type:', error);
        throw error;
    }
}

async function seedADX() {
    try {
        // Create the "adx" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_adx (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                name VARCHAR(255) NOT NULL,
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT null
            );
        `);

        console.log(`Created "tbl_adx" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding adx:', error);
        throw error;
    }
}

async function seedPlaystore() {
    try {
        // Create the "playstore" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_playstore (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                name VARCHAR(255) NOT NULL,
                owner VARCHAR(255) NOT NULL,
                service_number VARCHAR(255) NOT NULL,
                remark VARCHAR(255),
                status integer DEFAULT 1,
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT null
            );
        `);

        console.log(`Created "tbl_playstore" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding playstore:', error);
        throw error;
    }
}

async function seedApp() {
    try {
        // Create the "app" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_app (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                playstore VARCHAR(255),
                adx VARCHAR(255),
                name VARCHAR(255) NOT NULL,
                code VARCHAR(255),
                package VARCHAR(255),
                url VARCHAR(255),
                remark VARCHAR(255),
                file VARCHAR(255),
                status integer DEFAULT 1,
                total_cnt integer DEFAULT 0,
                yesterday_cnt integer DEFAULT 0,
                today_cnt integer DEFAULT 0,
                is_deleted integer DEFAULT 0,
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT null
            );
        `);

        console.log(`Created "tbl_app" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding apps:', error);
        throw error;
    }
}

async function seedAppSetting() {
    try {
        // Create the "app" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_apps_settings (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                app_id uuid,
                type integer DEFAULT 1,
                g1_percentage VARCHAR(20),
                g2_percentage VARCHAR(20),
                g3_percentage VARCHAR(20),
                g1_account_name VARCHAR(100),
                g2_account_name VARCHAR(100),
                g3_account_name VARCHAR(100),
                g1_banner VARCHAR(50),
                g2_banner VARCHAR(50),
                g3_banner VARCHAR(50),
                g1_inter VARCHAR(50),
                g2_inter VARCHAR(50),
                g3_inter VARCHAR(50),
                g1_native VARCHAR(50),
                g2_native VARCHAR(50),
                g3_native VARCHAR(50),
                g1_native2 VARCHAR(50),
                g2_native2 VARCHAR(50),
                g3_native2 VARCHAR(50),
                g1_appopen VARCHAR(50),
                g2_appopen VARCHAR(50),
                g3_appopen VARCHAR(50),
                g1_appid VARCHAR(50),
                g2_appid VARCHAR(50),
                g3_appid VARCHAR(50),
                app_remove_flag VARCHAR(15),
                app_version VARCHAR(10),
                app_remove_title VARCHAR(100),
                app_remove_description VARCHAR(255),
                app_remove_url VARCHAR(250),
                app_remove_button_name VARCHAR(50),
                app_remove_skip_button_name VARCHAR(50),
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT null
            );
        `);

        console.log(`Created "tbl_app" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding apps:', error);
        throw error;
    }
}

async function seedAppAdSetting() {
    try {
        // Create the "app" table if it doesn't exist
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_app_ad_settings (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                app_id uuid,
                type integer DEFAULT 1,
                is_bifurcate integer DEFAULT 0,
                bifurcate_location TEXT,
                app_color varchar(10),
                app_background_color varchar(10),
                native_loading varchar(10),
                bottom_banner varchar(10),
                all_screen_native varchar(10),
                list_native varchar(10),
                list_native_cnt integer,
                exit_dialoge_native varchar(10),
                native_btn varchar(10),
                native_btn_text varchar(15),
                native_background_color varchar(10),
                native_text_color varchar(10),
                native_button_background_color varchar(10),
                native_button_text_color varchar(10),
                alternate_with_appopen varchar(10),
                inter_loading varchar(10),
                inter_interval integer,
                back_click_inter integer,
                app_open_loading varchar(10),
                splash_ads varchar(10),
                app_open varchar(10),
                all_ads varchar(10),
                fullscreen varchar(10),
                adblock_version varchar(15),
                continue_screen varchar(10),
                lets_start_screen varchar(10),
                age_screen varchar(10),
                next_screen varchar(10),
                next_inner_screen varchar(10),
                contact_screen varchar(10),
                start_screen varchar(10),
                real_casting_flow varchar(10),
                app_stop varchar(10),
                additional_fields TEXT,
                vpn varchar(10),
                vpn_dialog varchar(10),
                vpn_dialog_open varchar(10),
                vpn_country TEXT,
                vpn_url varchar(300),
                vpn_carrier_id varchar(50),
                entry_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT null
            );
        `);

        console.log(`Created "tbl_app" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding apps:', error);
        throw error;
    }
}

async function seedNotification() {
    try {
        const createTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tbl_notification
            (
                id uuid DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
                user_id uuid,
                module_id uuid,
                notification_type character varying(50),
                is_read integer DEFAULT 0,
                for_admin integer DEFAULT 0,
                title text,
                message text,
                entry_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log(`Created "tbl_notification" table`);
        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding notification:', error);
        throw error;
    }
}

async function main() {
    await pool.connect();
    pool.on('error', (err) => {
        console.error('something bad has happened!', err.stack)
    })
  
    await seedUserTypes();
    await seedUsers();
    await seedADX();
    await seedPlaystore();
    await seedApp();
    await seedAppSetting();
    await seedNotification();
  
    return;
    // await client.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});
