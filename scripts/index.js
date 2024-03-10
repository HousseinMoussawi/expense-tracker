const symbol = document.getElementById('symbol')
const balance_currency = document.getElementById('balance-currency')
const balance_amount = document.getElementById('balance-amount')
const create = document.getElementById('create')


const converter = (from, to, amount) => {
    const convert = axios.post("https://crowded-cyan-wildebeest.cyclic.app/students/convert", {  
        "from": from,
        "to": to,
        "amount": amount
        
    })
    .then(response => {
        console.log(response.data)
    })
    
    }



const currencies = axios.get("https://crowded-cyan-wildebeest.cyclic.app/students/available")
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


    