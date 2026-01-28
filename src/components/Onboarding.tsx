'use client';

import { Card } from './ui/Card';
import { ConnectWallet } from './ConnectWallet';
import { Coin } from './Coin';

/**
 * Onboarding - 3-step visual guide for new users
 * Shown when wallet is not connected
 */
export function Onboarding() {
  return (
    <Card className="text-center py-8">
      {/* Animated coin preview */}
      <div className="mb-6">
        <Coin state="idle" selectedSide="heads" />
      </div>

      {/* Value proposition */}
      <h2 className="text-xl font-semibold mb-2">
        Ready to test your luck?
      </h2>
      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
        Flip a coin onchain. 3 free chances every day!
      </p>

      {/* 3-step guide */}
      <div className="flex justify-center gap-4 mb-8 px-4">
        <OnboardingStep 
          step={1} 
          icon="🔗" 
          label="Connect" 
          description="Wallet"
        />
        <OnboardingStep 
          step={2} 
          icon="👆" 
          label="Choose" 
          description="Heads/Tails"
        />
        <OnboardingStep 
          step={3} 
          icon="🪙" 
          label="Flip" 
          description="& Win!"
        />
      </div>

      {/* Connect CTA */}
      <div className="flex justify-center">
        <ConnectWallet />
      </div>

      {/* Trust signals */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span aria-hidden="true">✓</span> Free
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">⚡</span> No Gas
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">🔵</span> Built on Base
          </span>
        </div>
      </div>
    </Card>
  );
}

interface OnboardingStepProps {
  step: number;
  icon: string;
  label: string;
  description: string;
}

function OnboardingStep({ step, icon, label, description }: OnboardingStepProps) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="
          w-12 h-12 rounded-full 
          bg-gradient-to-br from-white/10 to-white/5 
          border border-white/10
          flex items-center justify-center text-xl mb-2
        "
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
