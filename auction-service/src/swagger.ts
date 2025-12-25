import swaggerJSDoc from "swagger-jsdoc";

const PORT = process.env.PORT;
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auction Platform API",
      version: "1.0.0",
      description: "API documentation for the Auction Platform",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
