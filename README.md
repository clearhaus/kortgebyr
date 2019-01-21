# Kortgebyr
This project is a modified multi-language version of https://github.com/ulrikmoe/kortgebyr

## Build locally

To build it locally, you will need [Node.js](https://nodejs.org/en/) and [Gulp 4](http://gulpjs.com).

```bash
git clone https://github.com/clearhaus/kortgebyr
cd kortgebyr
docker run --rm -it --net=host -v $PWD:/web -w /web node:8.1 bash
npm i
```
run the project with e.g. 'Norway information' use Norways abbreviation 'no'.
```bash
./node_modules/.bin/gulp --option no
```

## Adding countries

Go into src/js/data add another JavaScript file with the desired country.  
See the structure in the file no.js, there is two json objects ACQs (Acquirers) and PSPs (Gateways).  
An example of an Acquirer.  
```
{
      name: 'Nets',
      logo: 'nets.svg',
      link: https://www.nets.eu/dk/payments/online-betalinger/indloesningsaftale/',
      cards: ['visa', 'mastercard', 'jcb','amex'],
      fees: {
          setup(o){
            return new Currency(1000, 'NOK');
          },
          monthly(o){
            return new Currency(149, 'NOK');
          },
          trn() {
            if($qty <= 1000) return $avgvalue.scale(1.5/100);
            else return new Currency(3, 'NOK');
          }
      }
}
```    

An example of a Gateway
```
{
    name: 'DIBS',
    logo: 'dibs.svg',
    link: 'http://dibs.dk',
    cards: ['visa', 'mastercard', 'jcb'],
    acqs: ['Nets'],
    features: ['RecurringPayments','FraudControl'],
    fees: {
        setup: new Currency(3000,'NOK'),
        monthly(o) {
            return new Currency(300,'NOK');
        },
        trn() {
            return new Currency(3*$qty, 'NOK');
        }
    }
}
```

Furthermore there is a language folder, src/js/languages/ .
Insert the translation into a new file following the structure from no.json which can be found in the folder.

# Deployment

First set AWS credentials in the docker container:

```bash
$ read -s AWS_ACCESS_KEY_ID && export AWS_ACCESS_KEY_ID
$ read -s AWS_SECRET_ACCESS_KEY && export AWS_SECRET_ACCESS_KEY
```
## Staging
Run the following command to push to the staging AWS bucket:
```bash
./node_modules/.bin/s3-deploy './www/**' --cwd './www/' --region eu-west-1 --bucket {Bucket name} --gzip --etag
```

## Production
Run the following command to push to the production AWS bucket:
```bash
./node_modules/.bin/s3-deploy './www/**' --cwd './www/' --region eu-west-1 --bucket {Bucket name} --gzip --cache 86400 --etag
```

## License

Everything in this repository is licensed under the MIT license. [LICENSE](LICENSE).
