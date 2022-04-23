package main

import (
	"log"
	"strconv"

	"coinprice-api/cmcclient"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

var cmc *cmcclient.CMCClient

func main() {
	app := fiber.New()
	//cmc = cmcclient.NewCMCClient("pro-api.coinmarketcap.com", "b5f8749a-ca8f-4175-830a-c62a8558ed3f")
	cmc = cmcclient.NewCMCClient("sandbox-api.coinmarketcap.com", "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c")

	app.Use(cors.New(cors.ConfigDefault))
	app.Use(logger.New(logger.ConfigDefault))

	v1 := app.Group("v1")

	v1.Post("/convert", Convert)
	v1.Get("/list/crypto", ListCrypto)
	v1.Get("/list/fiat", ListFiat)

	log.Fatal(app.Listen(":3000"))
}

type ConvertRequest struct {
	Amount int       `json:"amount"`
	From   *Currency `json:"from"`
	To     *Currency `json:"to"`
}

type Currency struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Sign   string `json:"sign"`
	Symbol string `json:"symbol"`
}

func Convert(c *fiber.Ctx) error {
	req := &ConvertRequest{}
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	query := []*cmcclient.QueryParam{
		{Key: "amount", Value: strconv.Itoa(req.Amount)},
		{Key: "id", Value: strconv.Itoa(req.From.ID)},
		{Key: "convert_id", Value: strconv.Itoa(req.To.ID)},
	}

	resp, err := cmc.Get("/v2/tools/price-conversion", query)
	if err != nil {
		log.Print(err)
		return fiber.ErrInternalServerError
	}

	c.Type("json", "utf-8")
	return c.Status(fiber.StatusOK).SendString(string(resp))
}

func ListCrypto(c *fiber.Ctx) error {
	query := []*cmcclient.QueryParam{}

	resp, err := cmc.Get("/v1/cryptocurrency/map", query)
	if err != nil {
		log.Print(err)
		return fiber.ErrInternalServerError
	}

	c.Type("json", "utf-8")
	return c.Status(fiber.StatusOK).SendString(string(resp))
}

func ListFiat(c *fiber.Ctx) error {
	query := []*cmcclient.QueryParam{}

	resp, err := cmc.Get("/v1/fiat/map", query)
	if err != nil {
		log.Print(err)
		return fiber.ErrInternalServerError
	}

	c.Type("json", "utf-8")
	return c.Status(fiber.StatusOK).SendString(string(resp))
}
