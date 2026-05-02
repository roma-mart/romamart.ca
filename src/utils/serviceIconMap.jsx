import {
  AlertCircle, Banknote, Bitcoin, Candy, Coffee, CreditCard,
  Globe, Package, Printer, Send, ShoppingBag, ShoppingBasket,
  Sparkles, Ticket, UtensilsCrossed,
} from 'lucide-react';

const ICON_MAP = {
  alert_circle: <AlertCircle size={20} />,
  banknote: <Banknote size={20} />,
  bitcoin: <Bitcoin size={20} />,
  candy: <Candy size={20} />,
  coffee: <Coffee size={20} />,
  credit_card: <CreditCard size={20} />,
  globe: <Globe size={20} />,
  package: <Package size={20} />,
  printer: <Printer size={20} />,
  send: <Send size={20} />,
  shopping_bag: <ShoppingBag size={20} />,
  shopping_basket: <ShoppingBasket size={20} />,
  sparkles: <Sparkles size={20} />,
  ticket: <Ticket size={20} />,
  utensils_crossed: <UtensilsCrossed size={20} />,
};

export const resolveServiceIcon = (icon) => {
  if (!icon) return null;
  if (typeof icon !== 'string') return icon; // already a JSX element
  return ICON_MAP[icon] ?? null;
};
