document.addEventListener("alpine:init", () => {
    Alpine.data('pizzaCart', () => {
        return {
            title: 'Pizza Cart API',
            pizzas: [],
            filteredPizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0.00,
            message: '',
            showPizzas: false,
            cartHistory: [],
            HistCart: true,
            showHistoricalOrdersButton: false,
            historicalOrders: [],
            showHistoricalOrders: false,
            change: 0.00,

            login() {
                if (this.username.length > 3) {
                    localStorage['username'] = this.username;
                    this.createCart().then(() => {
                        this.showPizzas = true;
                        this.loadPizzas();
                        this.showHistoricalOrdersButton = false;
                    });
                } else {
                    alert("Username is too short");
                }
            },

            logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage.removeItem('cartId');
                    localStorage.removeItem('username');
                    this.pizzas = false;
                    this.showPizzas = false;
                    this.showHistoricalOrdersButton = false;
                }
            },

            createCart() {
                if (!this.username) {
                    this.cartId = 'Please type in a username';
                    return Promise.resolve();
                }

                const cartId = localStorage['cartId'];
                if (cartId) {
                    this.cartId = cartId;
                    return Promise.resolve();
                } else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`;
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code;
                            localStorage['cartId'] = this.cartId;
                        });
                }
            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
                return axios.get(getCartURL);
            },

            loadPizzas() {
                axios.get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        this.pizzas = result.data.pizzas;
                        this.filteredPizzas = this.pizzas;
                    })
                    .catch(error => {
                        console.error('Error fetching pizzas:', error);
                    });
            },

            // addfavorite(favPizzaId){
            //     return axios.post('https://pizza-api.projectcodex.net/api/pizzas/featured', {
            //         "username": this.username,
            //         "pizza_id" : favPizzaId
            //     }).then(()=>{
            //         this.showFav();
            //     })
            // },

            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                });
            },

            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                });
            },

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    "cart_code": this.cartId,
                    amount
                });
            },

            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                }).catch(error => {
                    console.error('Error fetching cart:', error);
                });
            },

            HistoricalCart() {
                const historyURL = `https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}/history`;
                return axios.get(historyURL)
                    .then(result => {
                        this.cartHistory = result.data.carts;
                        this.showHistoricalOrdersButton = true;
                    })
                    .catch(error => {
                        console.error('Error fetching cart history:', error);
                    });
            },

            toggleHistoricalOrders() {
                this.showHistoricalOrders = !this.showHistoricalOrders;
            },

            init() {
                const storedUsername = localStorage['username'];
                if (storedUsername) {
                    this.username = storedUsername;
                    this.showPizzas = true;
                    this.loadPizzas();
                }

                if (!this.cartId) {
                    this.createCart().then(() => {
                        this.showCartData();
                    });
                }
            },
            basil(pizzaId) {
                this.addPizza(pizzaId).then(() => {
                    this.showCartData();
                });
            },

            addPizzaToCart(pizzaId) {
                this.addPizza(pizzaId).then(() => {
                    this.showCartData();
                });
            },

            removePizzaFromCart(pizzaId) {
                this.removePizza(pizzaId).then(() => {
                    this.showCartData();
                });
            },

            payForCart() {
                this.pay(this.paymentAmount).then(result => {
                    if (result.data.status === 'failure') {
                        this.message = result.data.message;
                    } else {
                        if (this.paymentAmount > this.cartTotal) {
                            this.change = this.paymentAmount - this.cartTotal;
                            this.message = `Payment received. Your change is R${this.change.toFixed(2)}`;
                            this.HistoricalCart();
                        } else {
                            this.change = 0;
                            this.message = 'Payment received';
                            this.HistoricalCart();
                        }
                        setTimeout(() => {
                            // this.message = '';
                            // this.cartPizzas = [];
                            // this.paymentAmount = 0;
                            // this.createCart();
                            // localStorage.removeItem('cartId');
                            // this.cartTotal = 0.00;
                            // this.cartId = '';
                        }, 3000);
                        this.showHistoricalOrdersButton = true;
                    }
                });
            },

            confirmChangeCollected() {
                this.message = '';
                this.change = 0;
                this.message = '';
                this.change = 0;
                this.message = '';
                this.cartPizzas = [];
                this.paymentAmount = 0;
                this.createCart();
                localStorage.removeItem('cartId');
                this.cartTotal = 0.00;
                // this.cartId = '';    
                // this.username = '';
                // this.pizzas = false;
            },

            filterSize(size) {
                this.filteredPizzas = this.pizzas.filter(pizza => pizza.size === size);
            },
            HistoryCartButton() {
                this.HistCart = !this.HistCart;
            },

            increaseQuantity(pizzaId) {
                alert(`Increase quantity of pizza with ID: ${pizzaId}`);
            },

            decreaseQuantity(pizzaId) {
                alert(`Decrease quantity of pizza with ID: ${pizzaId}`);
            }

        };
    });
});
