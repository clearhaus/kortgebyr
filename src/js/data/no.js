const country_code = "NO";
const country_currency = "NOK";


const ACQs = [
    {
        name: 'Bambora',
        logo: 'bambora.svg',
        link: 'https://www.bambora.com/no/no/',
        contactMail: 'support@bambora.com',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            monthly: new Currency(245,'NOK'),
            trn() {
                return $avgvalue.scale(1.59 / 100);
            }
        }
    },
    {
      name: 'Nets',
      logo: 'nets.svg',
      link: 'https://www.nets.eu/no/payments/nettbetaling/',
      cards: ['visa', 'mastercard', 'jcb','amex'],
      contactMail: 'kundeservice-no@nets.eu',
      fees: {
          setup(o){
            return new Currency(Infinity, 'NOK');
          },
          monthly(o){
            return new Currency(Infinity, 'NOK');
          },
          trn() {
            return $avgvalue.scale(Infinity);
          }
      }
    },
    {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        link: 'https://www.clearhaus.com/no/',
        contactMail: 'hello@clearhaus.com',
        cards: ['visa', 'mastercard', 'maestro','Apple Pay'],
        fees: {
            trn() {
                return $avgvalue.scale(1.45 / 100);
            }
        }
    },
    {
        name: 'Swedbank',
        logo: 'swedbank.svg',
        link: 'https://www.swedbank.no/bedrift/kortinnl%C3%B8sning-og-terminaler/',
        contactMail: 'cardservices@swedbank.no',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
              //1.45 = 1.45% transaction rate
                return $avgvalue.scale(1.45 / 100);
            }
        }
    }

];

//Here you neeed to multiple the values with $qty if there is a fee per transaction
const PSPs = [
    {
        name: 'Standard',
        logo: 'dibs.svg',
        link: 'https://www.dibs.no/betalingslosninger',
        contactMail: 'salg@dibs.no',
        cards: ['visa', 'mastercard', 'jcb',{}],
        acqs: ['Nets'],
        features: ['RecurringPayments','FraudControl'],
        fees: {
            setup: new Currency(Infinity,'NOK'),
            monthly(o) {
              return new Currency(Infinity,'NOK');
            },
            trn() {
                return new Currency(Infinity, 'NOK');
            }
        }
    },
    {
        name: 'Small',
        logo: 'payex.svg',
        link: 'https://payex.no/',
        contactMail: 'salg@payex.com',
        cards: ['visa', 'mastercard', 'maestro','amex','jcb', 'diners'],
        features: [],
        fees: {
            monthly(o){
              return new Currency(199, 'NOK');
            },
            trn() {
              return $revenue.scale(3 / 100).add(new Currency(3 * $qty, 'NOK'));
            }
        }
    },
    {
        name: 'Standard',
        logo: 'payex.svg',
        link: 'https://payex.no/',
        contactMail: 'salg@payex.com',
        cards: ['visa', 'mastercard', 'maestro','amex','jcb','diners'],
        features: ['FraudControl'],
        fees: {
            monthly(o){
              return new Currency(595, 'NOK');
            },
            trn() {
              return $revenue.scale(2.5 / 100).add(new Currency(2.5 * $qty, 'NOK'));
            }
        }
    },
    {
        name: 'Standard',
        logo: 'paylike.svg',
        link: 'https://no.paylike.io/',
        contactMail: 'hello@paylike.io',
        cards: ['visa', 'mastercard', 'maestro','Apple Pay'],
        features: [],
        fees: {
            trn() {
              return $revenue.scale(1.35 / 100).add(new Currency(0.5 * $qty, 'NOK'));
            }
        }
    },
    {
      name: 'Online',
      logo: 'bambora.svg',
      link: 'https://www.bambora.com/no/no/',
      contactMail: 'support@bambora.com',
      cards: ['visa', 'mastercard','maestro'],
      features: ['RecurringPayments','FraudControl',{
        title: 'vipps',
        monthly: new Currency(49,'NOK')
      }],
      acqs: ['Bambora','Nets','Swedbank'],
      fees: {
        monthly: new Currency(245,'NOK'),
        trn(){
          return $revenue.scale(2.45 / 100);
        }
      }

    },
    {
        name: 'Standard',
        logo: 'paypal.svg',
        link: 'https://www.paypal.com/no/webapps/mpp/merchant',
        cards: ['visa', 'mastercard', 'amex'],
        features: [
          {
            title: 'FraudControl',
            trn() {
              return new Currency(0.5 * $qty, 'NOK');
            }
          },
          'RecurringPayments'
        ],
        fees: {
            trn() {
                return $revenue.scale(3.4 / 100).add(new Currency(2.8 * $qty, 'NOK'));

            }
        }
    },
    {
        name: 'Basic',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/nb/',
        contactMail: 'support@pensopay.com',
        cards: ['visa', 'mastercard', 'maestro',{title: 'Apple Pay',monthly: new Currency(65,'NOK')}],
        features: [
          {
            title: 'FraudControl',
            monthly: new Currency(79, 'NOK'),
            trn() {
              return new Currency(0.5 * $qty, 'NOK');
            }
          },
          {
              title: 'RecurringPayments',
              monthly: new Currency(79,'NOK')
          },
          'vipps'
        ],
        fees: {
            trn() {
              return $revenue.scale(1.5 / 100).add(new Currency(5 * $qty,'NOK'));
            }
        }
    },
    {
        name: 'Start Up',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/nb/',
        contactMail: 'support@pensopay.com',
        cards: ['visa', 'mastercard', 'maestro',{title: 'Apple Pay',monthly: new Currency(65,'NOK')}],
        features: [
          {
            title: 'FraudControl',
            monthly: new Currency(79, 'NOK'),
            trn() {
              return new Currency(0.5 * $qty, 'NOK');
            }
          },
          {
              title: 'RecurringPayments',
              monthly: new Currency(79,'NOK')
          },
          'vipps'
        ],
        fees: {
          monthly: new Currency(79,'NOK'),
            trn() {
                return $revenue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Business',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/nb/',
        contactMail: 'support@pensopay.com',
        cards: ['visa', 'mastercard', 'maestro',{title: 'Apple Pay',monthly: new Currency(65,'NOK')}],
        features: [
            {
              title: 'FraudControl',
              monthly: new Currency(79, 'NOK'),
              trn() {
                return new Currency(0.5 * $qty, 'NOK');
              }
            },
            {
                title: 'RecurringPayments',
                monthly: new Currency(79,'NOK')
            },
            'vipps'
        ],
        fees: {
          monthly: new Currency(139,'NOK'),
            trn() {
                if($qty <= 100) return $revenue.scale(1.45 / 100);
                else return $revenue.scale(1.45 / 100).add(new Currency(0.5 * ($qty - 100), 'NOK'));
            }
        }
    },
    {
      name: 'Premium',
      logo: 'pensopay.svg',
      link: 'https://pensopay.com/nb/',
      contactMail: 'support@pensopay.com',
      cards: ['visa', 'mastercard', 'maestro',{title: 'Apple Pay',monthly: new Currency(65,'NOK')}],
      features: [
          {
            title: 'FraudControl',
            monthly: new Currency(79, 'NOK'),
            trn() {
              return new Currency(0.5 * $qty, 'NOK');
            }
          },
          {
              title: 'RecurringPayments',
              monthly: new Currency(79,'NOK')
          },
          'vipps'
      ],
      fees: {
        monthly: new Currency(179,'NOK'),
          trn() {
              if($qty <= 100) return $revenue.scale(1.45 / 100);
              else return $revenue.scale(1.45 / 100).add(new Currency(0.5 * ($qty - 100), 'NOK'));
          }
      }
    },
    {
      name: 'Pro',
      logo: 'pensopay.svg',
      link: 'https://pensopay.com/nb/',
      contactMail: 'support@pensopay.com',
      cards: ['visa', 'mastercard', 'maestro',{title: 'Apple Pay',monthly: new Currency(65,'NOK')}],
      features: [
          {
            title: 'FraudControl',
            monthly: new Currency(79, 'NOK'),
            trn() {
              return new Currency(0.5 * $qty, 'NOK');
            }
          },
          {
              title: 'RecurringPayments',
              monthly: new Currency(79,'NOK')
          },
          'vipps'
      ],
      fees: {
        monthly: new Currency(199,'NOK'),
          trn() {
              if($qty <= 250) return $revenue.scale(1.40 / 100);
              else return $revenue.scale(1.40 / 100).add(new Currency(0.4 * ($qty - 250), 'NOK'));
          }
      }
    },
    {
        name: 'Standard',
        logo: 'stripe.svg',
        link: 'https://stripe.com/no',
        contactMail: 'info@stripe.com',
        cards: ['visa', 'mastercard', 'amex','Apple Pay'],
        features:[],
        fees: {
            trn() {
                return $revenue.scale(2.4 / 100).add(new Currency(2 * $qty,'NOK'));
            }
        }
    },
    {
        name: 'Basic',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/no/pricing',
        contactMail: 'support@quickpay.net',
        acqs: ['Nets','Clearhaus', 'PensoPay', 'Swedbank'],
        cards: ['visa','mastercard','jcb','amex',{title: 'Apple Pay',monthly: new Currency(59,'NOK')}],
        features: ['FraudControl','RecurringPayments','vipps'],
        fees: {
            trn() {
              return new Currency(7.5 * $qty, 'NOK');
            }
        }
    },
    {
        name: 'Starter',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/no/pricing',
        contactMail: 'support@quickpay.net',
        acqs: ['Nets','Clearhaus', 'PensoPay', 'Swedbank'],
        cards: ['visa','mastercard','jcb','amex',{title: 'Apple Pay',monthly: new Currency(59,'NOK')}],
        features: ['FraudControl','RecurringPayments','vipps'],
        fees: {
            monthly: new Currency(99, 'NOK'),
            trn() {
                return new Currency(1.75 * $qty,'NOK');
            }
        }
    },
    {
        name: 'Professional',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/no/pricing',
        contactMail: 'support@quickpay.net',
        acqs: ['Nets','Clearhaus', 'PensoPay', 'Swedbank'],
        cards: ['visa','mastercard','jcb','amex',{title: 'Apple Pay',monthly: new Currency(59,'NOK')}],
        features: ['vipps'],
        fees: {
            monthly: new Currency(199, 'NOK'),
            trn() {
                if($qty > 250) return new Currency(1 * ($qty - 250),'NOK');
            }
        }
    }
];
