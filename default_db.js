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
                remark VARCHAR(255) NOT NULL,
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
