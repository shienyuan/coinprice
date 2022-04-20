package main

import (
	"log"

	"coinprice-api/cmcclient"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

var cmc *cmcclient.CMCClient

func main() {
	app := fiber.New()
	cmc = cmcclient.NewCMCClient("pro-api.coinmarketcap.com", "b5f8749a-ca8f-4175-830a-c62a8558ed3f")

	app.Use(cors.New(cors.ConfigDefault))
	app.Use(logger.New(logger.ConfigDefault))

	v1 := app.Group("v1")

	v1.Get("/convert", Convert)
	v1.Get("/list/crypto", ListCrypto)
	v1.Get("/list/fiat", ListFiat)

	log.Fatal(app.Listen(":3000"))
}

func Convert(c *fiber.Ctx) error {
	query := []*cmcclient.QueryParam{
		{Key: "amount", Value: "123"},
		{Key: "symbol", Value: "BTC"},
		{Key: "convert", Value: "USD,NZD"},
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

type Currency struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Sign   string `json:"sign"`
	Symbol string `json:"symbol"`
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
