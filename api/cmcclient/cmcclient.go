package cmcclient

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type CMCClient struct {
	baseURL *url.URL
	apiKey  string
	*http.Client
}

func NewCMCClient(baseURl string) *CMCClient {
	httpClient := &http.Client{}
	httpBaseURL := &url.URL{
		Scheme: "https",
		Host:   baseURl,
	}
	httpApiKey := "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"

	return &CMCClient{
		Client:  httpClient,
		baseURL: httpBaseURL,
		apiKey:  httpApiKey,
	}
}

func (c *CMCClient) endpoint(endpoint string) string {
	return c.baseURL.ResolveReference(&url.URL{Path: endpoint}).String()
}

func (c *CMCClient) addHeader(request *http.Request) {
	request.Header.Set("Accepts", "application/json")
	request.Header.Add("X-CMC_PRO_API_KEY", c.apiKey)
}

type QueryParam struct {
	Key   string
	Value string
}

func (c *CMCClient) Get(endpoint string, query []*QueryParam) ([]byte, error) {
	req, err := http.NewRequest(http.MethodGet, c.endpoint(endpoint), nil)
	if err != nil {
		return nil, err
	}

	c.addHeader(req)

	q := url.Values{}
	for _, v := range query {
		q.Add(v.Key, v.Value)
	}
	req.URL.RawQuery = q.Encode()

	reqDump, err := httputil.DumpRequest(req, false)
	if err != nil {
		return nil, err
	}
	log.Print("Request:")
	fmt.Printf("%s", reqDump)

	resp, err := c.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respDump, err := httputil.DumpResponse(resp, true)
	if err != nil {
		return nil, err
	}
	log.Print("Response:")
	fmt.Printf("%s", respDump)

	return ioutil.ReadAll(resp.Body)
}
