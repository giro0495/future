(function() {
    function $_ (id) {
        return document.getElementById(id);
    }

    // $_('model').addEventListener('click', e=> {
    //     console.log(e);
    // })
    function $__(className) {
        return document.getElementsByClassName(className);
    }
    // $.('model').addEventListener('click', e=> {
    //     console.log(e);
    // })
    // console.log($__('model')[0]);
    var cl = '' ;
    for (var i = 0; i < $__('model').length; i++) {
        $__('model')[i].addEventListener('click', e => {
            console.log(e.currentTarget.id);
        })
    }
    /*LOGIN*/
    const btnSignIn = document.getElementById('btnSignIn');
    btnSignIn.addEventListener('click', e => {
        const auth = firebase.auth()
        auth.signInWithEmailAndPassword('gj95@hotmail.es', 'g090019049').catch(function(error) {
          // Handle Errors here.
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(errorMessage);
        });
    })
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            document.getElementsByClassName('login-cover')[0].className = 'login-cover hide';
            //Get Elements
            const preObject = document.getElementById('object');
            const ulList = document.getElementById('list');
            const selectCategory = document.getElementById('selectCategory');
            const tbProducts = document.getElementById('tbProducts');
            const resultSearch = document.getElementById('resultSearch');
            const facturation = document.getElementById('facturation');
            //Define reference
            const rootRef = firebase.database().ref();
            const refUsers = rootRef.child('users');
            const refProducts = rootRef.child('products');
            const refCategory = rootRef.child('category');
            // mostrar categorias para ingreso de productos
            refCategory.once('value', snap => {
                var d = snap.val();
                var keys = Object.keys(d);
                for (var i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const cat = d[key].category;
                    const op = document.createElement('option')
                    op.innerText = cat;
                    op.value = key;
                    selectCategory.appendChild(op)
                }
            })
            // mostrar productos en tabla
            refProducts.on('value', snap => {
                var table = '';
                var g = snap.val();
                var kk = Object.keys(g);
                for (var i = 0; i < kk.length; i++) {
                    const number = i+1;
                    const f = kk[i];
                    const categoryPro = g[f].category;
                    var categoryProName = rootRef.child('category/'+categoryPro);
                    categoryProName.orderByChild('category').on('value', snap => {
                        const categoryName = snap.val().category;
                        table +=    '<tr class="tr-product" data-id="'+f+'">'+
                                        '<td>'+number+'</td>'+
                                        '<td>'+categoryName+'</td>'+
                                        '<td>'+g[f].trademark+'</td>'+
                                        '<td>'+g[f].model+'</td>'+
                                        '<td>$ '+g[f].price+'</td>'+
                                        '<td>'+g[f].units+'</td>'+
                                    '</tr>';
                        tbProducts.innerHTML = table;
                        const nose = document.getElementsByClassName('tr-product');
                        for (var i = 0; i < nose.length; i++) {
                            nose[i].addEventListener('contextmenu', e=> {
                                const contextMenu = document.getElementsByClassName('context-menu')[0];
                                contextMenu.className = 'context-menu show2';
                                e.preventDefault();
                                const x = e.clientX;
                                const y = e.clientY;
                                const wWidth = window.innerWidth;
                                const wHeight = window.innerHeight;
                                const porcentW = Math.round((x/wWidth)*100);
                                const porcentH = Math.round((y/wHeight)*100);
                                document.getElementsByClassName('context-menu')[0].style.left = porcentW+'%';
                                document.getElementsByClassName('context-menu')[0].style.top = porcentH+'%';
                                console.log();
                                console.log();
                                const key = e.currentTarget.getAttribute("data-id");
                                const editItem = document.getElementsByClassName('edit-item')[0];
                                const deleteItem = document.getElementsByClassName('delete-item')[0];
                                editItem.setAttribute('data-id', key);
                                deleteItem.setAttribute('data-id', key);
                                editItem.addEventListener('click', e=>{
                                    const key = e.currentTarget.getAttribute('data-id');
                                    productEdit(key);
                                    contextMenu.className = 'context-menu';
                                })

                            })
                            // nose[i].addEventListener('click', e=> {
                            //     productEdit(key);
                            // })
                        }
                    })
                }
            })
            refProducts.on('child_changed', snap => {

            })
            refUsers.once('value', gotDataUsers, errData);
            function gotDataUsers(snap) {
                // var data = snap.val();
                // var keys = Object.keys(data);
                // for (var i = 0; i < keys.length; i++) {
                //     const uid = keys[i];
                //     const dni = data[uid].dni;
                //     const name = data[uid].name;
                //     const lname = data[uid].lname;
                //     const email = data[uid].email;
                //     const phone = data[uid].phone;
                //     const li = document.createElement('li');
                //     // li.id = uid;
                //     // li.setAttribute('data-id', uid);
                //     // li.innerText = email;
                //     // // li.className = 'items';
                //     // ulList.appendChild(li)
                // }
                // var items = document.getElementsByClassName('items');
                // for (var i = 0; i < items.length; i++) {
                //     items[i].addEventListener('click', e => {
                //         this.className = 'gison';
                //     })
                // }
            }
            function errData(err) {

            }
            const oneRef = rootRef.child('users').orderByChild('email');
            // var btnSignCliente = document.getElementById('btnSignClient');
            // var signClient = function (dni, name, lname, email, phone) {
            //     rootRef.child('users/').push({
            //         dni: dni,
            //         name: name,
            //         lname: lname,
            //         email: email,
            //         phone : phone
            //     });
            // }
            // btnSignClient.addEventListener('click', e => {
            //     var txtDni = document.getElementById('txtDni'),
            //         txtName = document.getElementById('txtName'),
            //         txtLname = document.getElementById('txtLname'),
            //         txtEmail = document.getElementById('txtEmail'),
            //         txtPhone = document.getElementById('txtPhone');
            //     var verifyDni = rootRef.child('users/').orderByChild('dni').equalTo(txtDni.value);
            //     verifyDni.once('value').then(snap => {
            //         if (snap.val() == null) {
            //             signClient(txtDni.value, txtName.value, txtLname.value, txtEmail.value, txtPhone.value);
            //         }else {
            //             // const li = document.createElement('li');
            //             // li.innerText = 'El cliente ya se encuentra registrado';
            //             // li.className = 'error';
            //             // ulList.appendChild(li)
            //             console.log('Ya se encuentra registrado');
            //         }
            //     })
            // })
            // ingreso de nuevo producto
            var productEntry = function (category, trademark, model, price, units, reference) {
                rootRef.child('products/').push({
                    category: category,
                    trademark: trademark,
                    model: model,
                    price: price,
                    units: units,
                    reference: reference
                });

            }
            const btnProductEntry = document.getElementById('btnProductEntry');
            btnProductEntry.addEventListener('click', e => {
                var slctCategory = document.getElementById('selectCategory'),
                    txtTrademark = document.getElementById('txtTrademark'),
                    txtModel = document.getElementById('txtModel'),
                    txtPrice = document.getElementById('txtPrice'),
                    txtUnits = document.getElementById('txtUnits'),
                    txtRef = document.getElementById('txtRef');
                var verifyProduct = rootRef.child('products/').orderByChild('model').equalTo(txtModel.value);
                verifyProduct.once('value', snap => {
                    if (snap.val() == null) {
                        productEntry(slctCategory.value, txtTrademark.value, txtModel.value, txtPrice.value, txtUnits.value, txtRef.value);
                    }
                })
            })
            // ingreso de nueva categoria
            const btnCategoryEntry = document.getElementById('btnCategoryEntry');
            btnCategoryEntry.addEventListener('click', e => {
                const category = document.getElementById('txtCategoryEntry');
                const verifyCategory = refCategory.orderByChild('category').equalTo(category.value);
                verifyCategory.once('value', snap => {
                    if (snap.val() == null) {
                        refCategory.push({
                            category: category.value
                        })
                    }else {
                        console.log('Ya existe la categoria, vete a la mierda');
                    }
                })
            })
            /*INICO DEL CODIGO PARA CONSULTA MEDIANTE CATEGORIA*/
            const txtSearch = document.getElementById('txtSearch');
            txtSearch.addEventListener('keyup', e => {
                var x = '',
                    classItem;
                const txtToSearch = txtSearch.value.toLowerCase();
                const refSearchCategory = rootRef.child('category/').orderByChild('category').startAt(txtToSearch).endAt(txtToSearch+'\uf8ff').limitToFirst(15);
                refSearchCategory.once('value').then(snap => {
                    if (snap.val() != null) {
                        var data = snap.val();
                        var keys = Object.keys(data);
                        for (var i = 0; i < keys.length; i++) {
                            const pkey = keys[i];
                            refProducts.orderByChild('category').equalTo(pkey).limitToFirst(15).once('value', snap => {
                                var da = snap.val();
                                var keys = Object.keys(da);
                                for(var i = 0; i < keys.length; i++){
                                    var pid = keys[i];
                                    var ref = rootRef.child('products/'+pid).limitToFirst(15);
                                    ref.once('value', snap => {
                                        const category = snap.val().category;
                                        const trademark = snap.val().trademark;
                                        const model = snap.val().model;
                                        const units = snap.val().units;
                                        const price = snap.val().price;
                                        if (units == 0) {
                                            classItem = 'error';
                                        }else if(units <= 5){
                                            classItem = 'warning';
                                        }else if (units >= 6){
                                            classItem = 'success';
                                        }
                                        var categoryProducts = rootRef.child('category/'+category).limitToFirst(15);
                                        categoryProducts.on('value', function(snapshot) {
                                            x += '<li id="'+pid+'" class="item" data-id="'+pid+'">'+' '+snapshot.val().category+' '+trademark+' '+model+'<span class="smallTxtRight price">$ '+price+'</span><span class="smallTxtRight units '+classItem+'">'+units+'</span></li>';
                                            resultSearch.innerHTML= x;
                                            var item = document.getElementsByClassName('item');
                                            for (var i = 0; i < item.length; i++) {
                                                item[i].addEventListener('click', e => {
                                                    e.stopPropagation();
                                                    const proKey = e.currentTarget.getAttribute('data-id');
                                                    productEdit(proKey);
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    }else {
                        x += '<li class="item">No se encontraron productos</li>';
                        resultSearch.innerHTML= x
                    }
                })
            })
            /*actualizacion de productos en el li*/
            refProducts.on('child_changed', snap => {
                const liChange = document.getElementById(snap.key);
                // const trChange = document.getElementsByClassName('tr-product')[0].getAttribute('data-id');
                // console.log(trChange);
                const category = snap.val().category;
                const trademark = snap.val().trademark;
                const model = snap.val().model;
                const units = snap.val().units;
                const price = snap.val().price;
                if (units == 0) {
                    classItem = 'error';
                }else if(units <= 5){
                    classItem = 'warning';
                }else if (units >= 6){
                    classItem = 'success';
                }
                var categoryProducts = rootRef.child('category/'+category).limitToFirst(15);
                categoryProducts.on('value', function(snapshot) {
                    if (liChange != null) {
                        liChange.innerText = snapshot.val().category+' '+trademark+' '+model;
                        liChange.className = 'item itemUpdate';
                        var spanUnit = document.createElement('span');
                        var spanPrice = document.createElement('span');
                        spanPrice.className = 'smallTxtRight price';
                        spanPrice.innerText = '$ '+price;
                        spanUnit.className = 'smallTxtRight units '+classItem;
                        spanUnit.innerText = units;
                        liChange.appendChild(spanPrice)
                        liChange.appendChild(spanUnit)
                        var id = setInterval(function(){
                            liChange.className = 'item';
                        }, 1000);
                        setTimeout("clearInterval("+id+")",3000);
                    }
                })
            })
            // eliminacion de prodyctos
            function deleteProduct(pKey) {
                console.log(pKey);

            }
            // actualizacion de producto en la base de datos
            function updateProduct(pKey, category, trademark, model, units, price, reference) {
                var postData = {
                    category: category,
                    trademark: trademark,
                    model: model,
                    units: units,
                    price: price,
                    reference: reference
                };
                // Get a key for a new Post.
                // var newPostKey = firebase.database().ref().child('posts').push().key;
                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/products/' + pKey] = postData;
                const promise = rootRef.update(updates);
                promise.catch(e => console.log(e.message));
            }
            //  edicion de productos
            function productEdit(key) {
                const proKey = key;
                document.getElementsByClassName('bg-modal')[0].className = 'bg-modal showDisplay';
                document.getElementsByClassName('box-modal')[0].className = 'box-modal show';
                const pKey = document.getElementById('proKey');
                const pTrademark = document.getElementById('editTextTrademark');
                const pModel = document.getElementById('editTextModel');
                const pUnits = document.getElementById('editTextUnits');
                const pPrice = document.getElementById('editTextPrice');
                const pReference = document.getElementById('editTextReference');
                const proEdit = rootRef.child('products/'+proKey);
                proEdit.once('value').then(snap => {
                    const newData = snap.val();
                    pKey.value = proKey;
                    pTrademark.value = newData.trademark;
                    pModel.value = newData.model;
                    pUnits.value = newData.units;
                    pPrice.value = newData.price;
                    pReference.value = newData.reference;
                    const btnUpdateProduct = document.getElementById('btnUpdateProduct');
                    btnUpdateProduct.addEventListener('click', e => {
                        updateProduct(pKey.value,newData.category, pTrademark.value, pModel.value, pUnits.value, pPrice.value, pReference.value);
                    })
                    const btnDeleteProduct = document.getElementById('btnDeleteProduct');
                    btnDeleteProduct.addEventListener('click', e => {
                        deleteProduct(pKey.value);
                    })
                })
            }
        }else {

        }
    })
    const btnAddProduct = document.getElementById('btnAddProduct');
    btnAddProduct.addEventListener('click', e => {
        var bgModal = e.currentTarget.nextElementSibling;
        var boxModal = bgModal.nextElementSibling;
        bgModal.className = 'bg-modal showDisplay';
        boxModal.className = 'box-modal show';
    })
    document.addEventListener('keyup', e => {
        if (e.keyCode == 27) {
            const bgModal = document.getElementsByClassName('bg-modal');
            for (var i = 0; i < bgModal.length; i++) {
                bgModal[i].className = 'bg-modal';
            }
            const boxModal = document.getElementsByClassName('box-modal');
            for (var a = 0; a < boxModal.length; a++) {
                boxModal[a].className = 'box-modal'

            }
        }
    })
    const searchBox = document.getElementById('txtSearch');
    document.addEventListener('click', e => {
        document.getElementsByClassName('resultSearch')[0].className = 'resultSearch hide';
    })
    searchBox.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementsByClassName('resultSearch')[0].className = 'resultSearch';
    })
    document.getElementsByClassName('bg-modal')[0].addEventListener('click', e=> {
        e.stopPropagation();
    })
    document.getElementsByClassName('box-modal')[0].addEventListener('click', e=> {
        e.stopPropagation();
    })
    /*close modal*/
    var btnClose = document.getElementsByClassName('close');
    for (var i = 0; i < btnClose.length; i++) {
        btnClose[i].addEventListener('click', e=> {
            var headerModal = e.currentTarget.parentNode;
            var boxModal = headerModal.parentNode;
            var bgModal = boxModal.previousElementSibling;
            boxModal.className = 'box-modal';
            bgModal.className = 'bg-modal';
        })
    }
}());
