import { ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { NavLinkProps } from "react-router-dom";
import IconButton from "../../common/button/iconButton";
import { useCart } from "../../context/cartContext";

type CartActionProps = {
  navLinkClass: NavLinkProps["className"];
};

function resolveClassName(navLinkClass: CartActionProps["navLinkClass"], isActive: boolean): string | undefined {
  if (typeof navLinkClass === "function") {
    return navLinkClass({
      isActive,
      isPending: false,
      isTransitioning: false,
    });
  }
  return navLinkClass;
}

export default function CartAction({ navLinkClass }: CartActionProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { cart } = useCart();
  const cartCount = cart?.items_count ?? 0;
  const isCartActive = pathname === "/cart";
  const navClass = resolveClassName(navLinkClass, isCartActive);

  return (
    <IconButton type="button" variant="ghost" size="md" aria-label={cartCount > 0 ? `Panier, ${cartCount} articles` : "Panier"} onClick={() => navigate("/cart")} className={[navClass, "!h-auto !w-auto min-h-11 gap-2"].filter(Boolean).join(" ")}>
      <ShoppingCart className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="inline-flex items-center gap-2">
        Panier
        {cartCount > 0 ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white tabular-nums" aria-hidden>
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        ) : null}
      </span>
    </IconButton>
  );
}
