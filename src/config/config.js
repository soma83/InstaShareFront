/**
 * Main configuration
 */
const SERVER = 'http://localhost';
const PORT = '3000';
const API = 'api/v1/';

/**
 * Main endpoints URL
 */
export const URL = `${SERVER}:${PORT}/${API}`;

/**
 * Users URLs
 */
export const URL_USERS = `${URL}users`;
export const URL_LOGIN = `${URL}login`;
export const URL_REQUEST = `${URL}request`; // aims to request the user secret
export const URL_RESPOND = `${URL}respond`; // aims to response the user secret
export const URL_UPDT_PASSW = `${URL}updatepsw`;
export const URL_UPDT_STATUS = `${URL}updatestatus`;
