import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../errors/statusCodeMessage";

import { getAuthToken } from "../../../utils/localStorage";
import {convertBiggestCoinUnit} from "../../../utils/numbers";

// importar servico
import PaymentService from "../../../services/paymentService";
import UserService from "../../../services/userService";
import CoinService from "../../../services/coinService";

// iniciar servico
const paymentService = new PaymentService();
const userService = new UserService();
const coinService = new CoinService();

export function* setModalStepSaga(payload){
  yield put(
    {
      type: "SET_MODAL_PAY_STEP_REDUCER",
      step: payload.step
    }
  );
}

export function* getCoinsEnabledSaga() {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(paymentService.getCoins, token);

    const services = response.data.services;

    const coins = services.map(coin => {
      return {
        title: coin.name,
        value: {
          abbreviation: coin.abbreviation,
          address: coin.address
        },
        img: `/images/icons/coins/${coin.abbreviation}.png`
      }
    });

    yield put({
      type: "GET_COINS_REDUCER",
      coins: coins
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setPaymentSaga(payload) {
  try {
    // abrir loading 
    yield put(
      {
        type: "SET_LOADING_REDUCER",
        payload: true
      }
    )
    
    // chamar a quantidade de moedas necessarias
    let token = yield call(getAuthToken);
    let response = yield call(coinService.getCoinPrice, payload.pay.coin.abbreviation, 'brl', token);
    
    //console.log("response pay", response);
    const balanceResponse = yield call(
      coinService.getCoinBalance,
      payload.pay.coin.abbreviation,
      payload.pay.coin.address,
      token
    );
    
    //console.log("response balance", balanceResponse);

    const balance = balanceResponse.data.data.available;
    const value = parseFloat(payload.pay.value);
    const amount = parseFloat(value / response.data.data.price);
    
    //console.log("value", payload.pay);
    //console.log("amount", response.data.data.price);
    
    const data = {
      number: payload.pay.number,
      coin: payload.pay.coin,
      balance: convertBiggestCoinUnit(balance, 8),
      amount: parseFloat(amount.toFixed(8)),
      value: value.toFixed(2).replace('.', ','),
      assignor: payload.pay.assignor,
      name: payload.pay.name,
      dueDate: payload.pay.dueDate,
      description: payload.pay.description,
      cpfCnpj: payload.pay.cpfCnpj
    }
    
    //console.log("response data", data);
    
    yield put(
      {
        type: "SET_PAYMENT_REDUCER",
        payload: data
      }
    )
  } catch(error) {
    yield put(internalServerError());
  }
}

export function* getFeePaymentSaga(payload) {
  try {
    // abrir loading 
    yield put(
      {
        type: "SET_LOADING_REDUCER",
        payload: true
      }
    );

    let response = yield call(
      coinService.getFee,
      payload.coin,
      payload.fromAddress,
      payload.toAddress,
      payload.amount,
      payload.decimalPoint
    );

    yield put({
      type: "GET_FEE_PAYMENT_REDUCER",
      fee: response
    });

  } catch(error) {
    yield put(internalServerError());
  }
}

export function* setFeePaymentSaga(payload) {
  yield put({
    type: "SET_FEE_PAYMENT_REDUCER",
    fee: payload.fee
  });
}

export function* getInvoiceSaga(payload) {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(paymentService.getInvoice, token, payload.number);

    yield put({
      type: "GET_INVOICE_REDUCER",
      payment: response
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* setUserGdprSaga(payload) {
  try {
    const token = yield call(getAuthToken);
   yield call(userService.updateUser, payload.user, token);

    yield put({
      type: "GET_USER_GDPR_REDUCER",
      user: payload.user
    })
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getHistoryPaySaga(){
  try {
    // let token = yield call(getAuthToken);
    //let response = yield call(paymentService.getHistory, token);

    const response = [
      {
        name: "Energia",
        date: "04/09/2018 17:00",
        status: "confirmado",
        coin: "lunes",
        amount: "50000",
        value: "45.90"
      },
      {
        name: "Plano Saude",
        date: "04/09/2018 17:00",
        status: "confirmado",
        coin: "lunes",
        amount: "1000",
        value: "205.00"
      }
    ];

    yield put({
      type: "GET_HISTORY_PAY_REDUCER",
      history: response
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* confirmPaySaga(payment){
  try {
    // ligar o loading 
    yield put(
      {
        type: "SET_LOADING_REDUCER",
        payload: true
      }
    );

    // validar a carga recebida, formatar se preciso 
    console.log("CONFIRMAR", payment);

    // pegar a senha pra liberar a chave 

    // enviar transacao 

    // caso sucesso, chamar api (EM DEV)

    // chamar modal de confirmacao 
    yield put(
      {
        type: "SET_MODAL_PAY_STEP_REDUCER",
        step: 5
      }
    );

    // libearar loading 

    // limpar reducer 

  }catch(error){
    yield put(internalServerError());
  }
}