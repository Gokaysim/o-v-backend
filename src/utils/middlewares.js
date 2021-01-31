import express from "express";
import cors from "cors";
import helmet from "helmet";

export default function (app) {
    app.use(cors());

    app.use(express.json());
    app.use(
        helmet({
            hsts: false
        })
    );
}
