/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //defining allowed image source patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
