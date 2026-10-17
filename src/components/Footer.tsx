import { UtensilsCrossed, Headphones, QrCode, CreditCard, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenInfoModal?: (title: string, content: string) => void;
}

export function Footer({ onOpenInfoModal }: FooterProps) {
  const links = [
    { label: 'About Us', text: 'CraveBite brings artisanal, chef-crafted meals to your doorstep in under 30 minutes with cloud kitchens across Bengaluru.' },
    { label: 'Our Chefs', text: 'Our head culinary directors are Michelin-trained alumni specializing in sourdough pizzas, smash burgers, and slow-braised curries.' },
    { label: 'Delivery Areas', text: 'Now serving: Indiranagar, Koramangala, HSR Layout, Whitefield, Bellandur, JP Nagar, and MG Road.' },
    { label: 'Partner with Us', text: 'Join CraveBite as a cloud kitchen partner, supplier, or delivery fleet associate. Earn competitive payouts daily.' },
    { label: 'Privacy Policy', text: 'We respect your data privacy and maintain zero spam, end-to-end payment encryption, and strict GDPR compliance.' },
  ];

  const handleLinkClick = (title: string, content: string) => {
    if (onOpenInfoModal) {
      onOpenInfoModal(title, content);
    }
  };

  return (
    <footer className="pt-6 pb-24 px-4 bg-slate-50 border-t border-slate-200/80">
      {/* Brand & mission */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
          Crave<span className="text-orange-500">Bite</span>
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-5">
        Elevating everyday dining into an indulgent visual ritual. Connecting hungry souls with passionate kitchens, gourmet chefs, and lightning-fast doorstep delivery.
      </p>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => handleLinkClick(link.label, link.text)}
            className="px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-slate-700 text-xs font-semibold border border-blue-100/60 transition-colors"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Payment and Support Row */}
      <div className="flex items-center justify-between py-3 border-y border-slate-200/60 mb-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>ACCEPTED:</span>
          <div className="flex items-center gap-2.5 text-slate-700 normal-case font-semibold text-xs">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              UPI
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              Cards
            </span>
            <span>Paytm</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <button
            onClick={() => handleLinkClick('Scan QR Payment', 'Scan the QR code printed on your delivery receipt to pay via any UPI app.')}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:text-orange-600 transition-colors"
            title="Scan QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLinkClick('24/7 Priority Support', 'Live support executive available 24/7. Call 1800-CRAVE-99 or email care@cravebite.app')}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:text-orange-600 transition-colors"
            title="24/7 Support"
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        © 2025 CraveBite Technologies Inc. All rights reserved. Made with love for hearty foodies.
      </p>
    </footer>
  );
}
