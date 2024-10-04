import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    generateEtags: false,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
};

export default nextConfig;