const symbol = document.getElementById('symbol')
const balance_currency = document.getElementById('balance-currency')
const balance_amount = document.getElementById('balance-amount')
const create = document.getElementById('create')
const create_amount = document.getElementById('create-amount')
const create_type = document.getElementById('create-type')
const create_currency = document.getElementById('create-currency')


let transaction = []
let balance = 10000
localStorage.setItem('balance', balance)



const converter = (from, to, amount) => {
    axios.post("https://crowded-cyan-wildebeest.cyclic.app/students/convert", {  
        "from": from,
        "to": to,
        "amount": amount
        
    })
    .then(response => {
        console.log(response.data)
    })
    
    }



const currencies = axios.get("https://rich-erin-angler-hem.cyclic.app/students/available")
    .then(response => {
        
        const addSymbol = () => {
            symbol.innerHTML = response.data.find(currency => currency.code === balance_currency.value).symbol
        }
        addSymbol()
        let from = balance_currency.value.toString()
        balance_currency.addEventListener('change', ()=>{
            console.log(from)
            converter(from,balance_currency.value.toString(),parseInt(balance_amount.innerHTML))
            from = balance_currency.value.toString()
            console.log(from)
            addSymbol()
            
        })
    }) 


const createTransaction = (amount, type, currency,id) => {
    localStorage.getItem('id') ? id = localStorage.getItem('id') : id = 0
    transaction.push({
        "id": id,
        "amount": amount,
        "type": type,
        "currency": currency
    })
    id++
    localStorage.setItem('id', id)
    
    localStorage.setItem('transaction', JSON.stringify(transaction))
}

create.addEventListener('click', () => {
    createTransaction(create_amount.value, create_type.value, create_currency.value)
    if(create_type.value === 'INCOME'){
        balance += parseInt(create_amount.value)
    }
    
})