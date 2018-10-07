import "allocator/arena";
export { allocate_memory };

import { Address, Value, Entity, store } from "@graphprotocol/graph-ts";
import { Transfer, Approval, ERC20 } from "../types/ERC20/ERC20";
import { HarbergerAds } from "../types/HarbergerAds/HarbergerAds";

let harbergerAdsAddress = Address.fromString(
  // "72Bc6Ea507A449f63877ccA54B27c45Ee06C985f" // rinkeby
  "298861323e8b68f8CD2Ee6Ca69eaF329Cfc2453E"
);

export function handleTransfer(event: Transfer): void {
  let ERC20Contract = ERC20.bind(event.address);

  let fromUser: Entity;
  let fromUserExists = store.get("User", event.params.from.toHex());

  if (fromUserExists != null) {
    fromUser = fromUserExists as Entity;
    //update fromUser's balance & allowance
    let fromUserNewBalance = ERC20Contract.balanceOf(event.params.to);
    let fromUserNewAllowance = ERC20Contract.allowance(
      event.params.to,
      harbergerAdsAddress
    );
    fromUser.setU256("balance", fromUserNewBalance);
    fromUser.setU256("allowance", fromUserNewAllowance);
    store.set("User", event.params.from.toHex(), fromUser);
  }

  let toUser: Entity;
  let toUserExists = store.get("User", event.params.to.toHex());
  if (toUser == null) {
    toUser = new Entity();
    toUser.setString("id", event.params.to.toHex());
    // address, balance, allowance
    toUser.setAddress("address", event.params.to);
  } else {
    toUser = toUserExists as Entity;
  }
  let toUserNewBalance = ERC20Contract.balanceOf(event.params.to);
  let toUserNewAllowance = ERC20Contract.allowance(
    event.params.to,
    harbergerAdsAddress
  );
  toUser.setAddress("address", event.params.to);
  toUser.setU256("balance", toUserNewBalance);
  toUser.setU256("allowance", toUserNewAllowance);
  store.set("User", event.params.to.toHex(), toUser);
}

export function handleApproval(event: Approval): void {
  // let user: Entity;

  let userExists = store.get("User", event.params.owner.toHex());
  if (userExists != null) {
    let ERC20Contract = ERC20.bind(event.address);

    let user = userExists as Entity;
    let userNewAllowance = ERC20Contract.allowance(
      event.params.owner,
      harbergerAdsAddress
    );
    user.setU256("allowance", userNewAllowance);
    store.set("User", event.params.owner.toHex(), user);
  }
}
