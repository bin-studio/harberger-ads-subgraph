import "allocator/arena";
export { allocate_memory };

import { Value, Entity, store } from "@graphprotocol/graph-ts";
import {
  TaxesPaid,
  Change,
  HarbergerAds
} from "../types/HarbergerAds/HarbergerAds";

export function handleChange(event: Change): void {
  let harbergerAdsContract = HarbergerAds.bind(event.address);
  // let taxRecipient = harbergerAdsContract.taxRecipient();
  let property: Entity;
  let propertyExists = store.get("Property", event.params.id.toHex());

  if (propertyExists == null) {
    property = new Entity();
    // property.setString("id", propertyExists.id);
    property.setString("id", event.params.id.toHex());
    property.setU256("propertyId", event.params.id);
    property.setArray("previousOwners", new Array<Value>());
    // let owner = token.getString("currentOwner")
  } else {
    property = propertyExists as Entity;
    let previousOwners = property.getArray("previousOwners");
    previousOwners.push(Value.fromAddress(event.params.from));
    property.setArray("previousOwners", previousOwners);
  }
  property.setAddress("owner", event.params.to);
  property.setU256("price", event.params.price);
  store.set("Property", event.params.id.toHex(), property);
}

export function handleTaxesPaid(event: TaxesPaid): void {}
