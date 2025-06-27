"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
data_source_1.AppDataSource.initialize().then(() => {
    console.log("✅ DataSource initialized");
}).catch((err) => {
    console.error("❌ Failed to initialize DataSource", err);
});
//# sourceMappingURL=test.js.map