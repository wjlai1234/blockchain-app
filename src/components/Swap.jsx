import ethLogo from "../images/eth-logo.png";
import tokenLogo from "../images/img.png";

const Swap = () => (
    <div className="gradient-bg-transactions pb-20">
        <div className="container ">
            <div className="row">
                <div className="col col-md-6 offset-md-3 white-glassmorphism" id="window">
                    <h4 className="swapheader">Swap</h4>
                    <div id="form" uk-sortable>
                        <div className="swapbox gradient-bg-welcome uk-card" >
                            <div className="swapbox_select token_select" id="from_token_select">
                                <img src={ethLogo} className="token_image" id="from_token_img" alt=""/>
                                    <span className="p-3"  id="from_token_text">ETH</span>
                            </div>
                            <div className="swapbox_select">
                                <input className="number form-control" placeholder="amount" id="from_amount"/>
                            </div>
                        </div>
                        <div className="swapbox gradient-bg-welcome uk-card">
                            <div className="swapbox_select token_select" id="to_token_select">
                                <img src={tokenLogo}  className="token_image " id="to_token_img"  alt=""/>
                                    <span className="p-3" id="to_token_text">TKB</span>
                            </div>
                            <div className="swapbox_select">
                                <input className="number form-control" placeholder="amount" id="to_amount"/>
                            </div>
                        </div>
                        <div className="pb-3">Estimated Gas: <span id="gas_estimate"></span></div>
                        <button  className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]" id="swap_button">
                            Swap
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal" id="token_modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select token</h5>
                        <button id="modal_close" type="button" className="close" data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div id="token_list"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Swap;
