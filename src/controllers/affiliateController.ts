import type { Request, Response } from 'express'
import { PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export class AffiliateController {

  // MOSTRAR AFILIADOS

  static async index(req: Request, res: Response) {

  try {

    const affiliates = await prisma.affiliate.findMany();

    res.render("affiliates/index", {
      affiliates
    });

  } catch (error) {

    console.log(error);

    res.send("Error al obtener afiliados");
  }
}

static async createView(req: Request, res: Response) {

  res.render("affiliates/create");
}

  // CREAR AFILIADO

  static async create(req: Request, res: Response) {

    try {

      const {
        firstName,
        lastName,
        email,
        membershipType
      } = req.body;

      await prisma.affiliate.create({
        data: {
          firstName,
          lastName,
          email,
          membershipType
        }
      });

      res.redirect("/affiliates");

    } catch (error) {

      console.log(error);

      res.send("Error al crear afiliado");
    }
  }

  // VER DETALLE

  static async show(req: Request, res: Response) {
    
    try {

      const id = Number(req.params.id);
      const affiliate = await prisma.affiliate.findUnique({
  where: {
    id
  }
});

      if (!affiliate) {
        return res.redirect("/affiliates");
      }

      res.render("affiliates/detail", {
        affiliate
      });

    } catch (error) {

      console.log(error);

      res.send("Error al obtener afiliado");
    }
  }

  // FORM EDITAR

  static async editView(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      const affiliate = await prisma.affiliate.findUnique({
        where: {
          id
        }
      });

      if (!affiliate) {
        return res.redirect("/affiliates");
      }

      res.render("affiliates/edit", {
        affiliate
      });

    } catch (error) {

      console.log(error);

      res.send("Error al cargar edición");
    }
  }

  // ACTUALIZAR

  static async update(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      const {
        firstName,
        lastName,
        email,
        membershipType
      } = req.body;

      await prisma.affiliate.update({
        where: {
          id
        },

        data: {
          firstName,
          lastName,
          email,
          membershipType
        }
      });

      res.redirect("/affiliates");

    } catch (error) {

      console.log(error);

      res.send("Error al actualizar afiliado");
    }
  }

  // ELIMINAR

  static async delete(req: Request, res: Response) {

    try {

      const id = Number(req.params.id);

      await prisma.affiliate.delete({
        where: {
          id: id
        }
      });

      res.redirect("/affiliates");

    } catch (error) {

      console.log(error);

      res.send("Error al eliminar afiliado");
    }
  }

  // SIMULADOR DESCUENTO

  static async simulate(req: Request, res: Response) {

  try {

    const id = Number(req.params.id);

    const amount = Number(req.body.amount);

    const affiliate = await prisma.affiliate.findUnique({
      where: {
        id
      }
    });

    if (!affiliate) {
      return res.redirect("/affiliates");
    }

    let discount = 0;

    if (affiliate.membershipType === "silver") {
      discount = 0.05;
    }

    if (affiliate.membershipType === "gold") {
      discount = 0.10;
    }

    if (affiliate.membershipType === "platinum") {
      discount = 0.20;
    }

    const finalPrice = amount - (amount * discount);

    res.render("affiliates/detail", {
  affiliate,

  simulation: {
    amount,
    finalPrice,
    discountPercentage: discount * 100
  }
});

  } catch (error) {

    console.log(error);

    res.send("Error simulando descuento");
  }
}}