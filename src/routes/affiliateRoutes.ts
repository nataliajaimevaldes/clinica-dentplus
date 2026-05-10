import { Router } from "express";

import { AffiliateController } from "../controllers/affiliateController.js";

const router = Router();

router.get("/", AffiliateController.index);

router.get("/create", AffiliateController.createView);

router.post("/create", AffiliateController.create);

router.get("/edit/:id", AffiliateController.editView);

router.post("/update/:id", AffiliateController.update);

router.post("/delete/:id", AffiliateController.delete);

router.post("/simulate/:id", AffiliateController.simulate);

router.get("/:id", AffiliateController.show);

export default router;