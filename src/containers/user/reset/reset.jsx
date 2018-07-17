import React from "react";
import i18n from "../../../utils/i18n";
import { Link } from "react-router-dom";

// COMPONENTS
import Footer from "../footer";

// STYLE
import style from "../style.css";


class Reset extends React.Component {
  constructor() {
    super()
    this.state = {
      step: 0,
      userInput: undefined,
      inputError: false
    }
  }

  getInput = (input) => {
    let { name, value } = input;
    this.setState({
      ...this.state,
      inputs: { ...this.state.inputs, [name]: { type: name, value } }
    });
  };


  inputValidator = () => {
    let { step, userInput } = this.state
    if (!userInput) {
      return this.setState({
        inputError: true
      })
    } else {
      this.setState({ step: step + 1 });
    }
  }

  cont_1 = () => {
    let { inputError } = this.state;
    return (
      <div>
        <img src="../../images/logo.svg" className={style.logo} />
        <img src="../../../../images/reset/ic-email.png" className={style.iconEmail} />

        <div className={style.resetHeader}>{i18n.t("RESET_HEADER")}</div>

        <div className={style.p}>{i18n.t("RESET_INSTRUCTIONS")}</div>
        <div className={style.p2}>{i18n.t("RESET_INSTRUCTIONS2")}</div>

        <input
          placeholder={i18n.t("PLACEHOLDER_EMAIL")}
          className={inputError ? style.inputError : style.inputTextDefault}
          onChange={(value) => this.getInput(value.target.value)}
        />

        <button className={style.buttonBorderGreen} onClick={() => this.inputValidator()}>
          {i18n.t("BTN_RESET")}
        </button>
      </div>
    )
  }

  cont_2 = () => {
    return (
      <div>
        <Link to="/login">
          <img src="../../images/icons/1x/baseline_arrow_forward_white_18dp.png" className={style.iconArrow} />
        </Link>

        <img src="../../images/logo.svg" className={style.logo} />

        <img src="../../../../images/reset/ic-email.png" className={style.iconEmail} />

        <div className={style.resetEmailSend}>{i18n.t("RESET_EMAIL_SEND")}</div>

        <button className={style.buttonBorderGreen}>
          <Link className={style.resetLinkLogin} to="/login">
            {i18n.t("BTN_LOGIN")}
          </Link>
        </button>

      </div>
    )
  }

  render() {
    let { step } = this.state
    let contents = [this.cont_1(), this.cont_2()];
    return (
      <div className={style.contGeneral}>

        {contents[step]}

        <Footer />

      </div>
    );
  }
}

export default Reset;
