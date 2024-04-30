
# Canditech Flowdesk


## Quick Start

Clone the repo

```sh
- git clone https://github.com/BornLimitles5/Flowdesk.git
- cd Project-Name
```

## Build the project

```bash
docker build -t my-node-app .
```


## Start the project

```bash
docker run -p 3000:3000 my-node-app npm run dev
```


## API Utilisation

#### Buy or Sell Order

```http
  GET /cumulative-delta/:symbol/:side/:amount
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `symbol` | `string` | Required. Symbol of the trading pair. |
| `side` | `string` | Required. Side of the order (buy or sell). |
| `amount` | `number` | Required. Amount of the order. |

#### Response

`cumulative_delta`: Cumulative delta value for the specified parameters.

#### Fetch symbol data

```http
  GET /cumulative-delta/:symbol
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `symbol` | `string` | Required. Symbol of the trading pair. |

#### Response

`symbol_data`: Json of the Data related to the specified symbol.



#### Reset Symbol table

```http
  POST /cumulative-delta/:symbol
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `symbol` | `string` | Required. Symbol of the trading pair. |

#### Response

`message`: Confirmation message indicating the symbol table has been reset.


## Authors

- [@Ash](https://github.com/BornLimitles5)

