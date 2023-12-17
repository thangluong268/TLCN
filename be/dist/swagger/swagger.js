"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_config_1 = require("./swagger.config");
function createDocument(app) {
    const builder = new swagger_1.DocumentBuilder()
        .setTitle(swagger_config_1.SWAGGER_CONFIG.title)
        .setDescription(swagger_config_1.SWAGGER_CONFIG.description)
        .setVersion(swagger_config_1.SWAGGER_CONFIG.version)
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Authorization');
    for (const tag of swagger_config_1.SWAGGER_CONFIG.tags) {
        builder.addTag(tag);
    }
    const option = {
        operationIdFactory: (controllerKey, methodKey) => methodKey
    };
    const builds = builder.build();
    return swagger_1.SwaggerModule.createDocument(app, builds, option);
}
exports.createDocument = createDocument;
//# sourceMappingURL=swagger.js.map