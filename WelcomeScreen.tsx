import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, Check, Shield, FileText, Heart } from "lucide-react";

interface WelcomeScreenProps {
  onAccept: () => void;
}

export function WelcomeScreen({ onAccept }: WelcomeScreenProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FAF8FF] via-[#FFF5F8] to-[#F5F0FF] dark:from-[#1A1625] dark:via-[#221933] dark:to-[#1A1625] p-4">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-[#2A2035]/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-[#E8D5F5] dark:border-[#3D2A4D]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B894E8] to-[#FFB3C6] p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src="https://i.imgur.com/Dc3f5ZQ.jpeg" 
                alt="Sena - Assistente Digital"
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <Sparkles className="w-6 h-6 text-[#B894E8]" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vinda à Sena! ✨
          </h1>
          <p className="text-white/90 text-lg">
            Sua assistente digital kawaii e acessível 💜
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* O que ela pode fazer */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#4A3B5C] dark:text-[#F5F0FF] mb-4">
              <Heart className="w-5 h-5 text-[#B894E8]" />
              O que posso fazer por você
            </h2>
            <div className="grid gap-3">
              <FeatureItem icon="📱" text="Ensinar a usar o celular de forma simples" />
              <FeatureItem icon="💬" text="Ajudar com WhatsApp, e-mail e mensagens" />
              <FeatureItem icon="🏦" text="Orientar sobre banco digital e PIX" />
              <FeatureItem icon="🛒" text="Guiar em compras online seguras" />
              <FeatureItem icon="🎤" text="Leitura de voz e comando por voz (STT/TTS)" />
              <FeatureItem icon="♿" text="Recursos completos de acessibilidade" />
            </div>
          </div>

          {/* Especialidades */}
          <div className="bg-gradient-to-br from-[#F5F0FF] to-[#FFE5EC] dark:from-[#2A2035] dark:to-[#3D2A4D] p-4 rounded-2xl">
            <h3 className="font-semibold text-[#4A3B5C] dark:text-[#F5F0FF] mb-2">
              🌸 Especialmente pensada para:
            </h3>
            <ul className="space-y-1 text-sm text-[#4A3B5C] dark:text-[#E8D5F5]">
              <li>• Pessoas com 60+ anos</li>
              <li>• Pessoas com dificuldades visuais ou motoras</li>
              <li>• Quem está começando com tecnologia</li>
            </ul>
          </div>

          {/* Termos e Políticas */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#4A3B5C] dark:text-[#F5F0FF]">
              <Shield className="w-5 h-5 text-[#B894E8]" />
              Privacidade e Segurança
            </h2>
            
            <div className="flex items-center gap-3 p-4 bg-[#F5F0FF] dark:bg-[#2A2035] rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#B894E8] text-[#B894E8] focus:ring-2 focus:ring-[#B894E8] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-[#4A3B5C] dark:text-[#E8D5F5] cursor-pointer flex-1">
                Li e aceito os{" "}
                <a
                  href="https://termos.orpheostudio.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B894E8] hover:text-[#9B7BC8] underline font-medium"
                >
                  Termos de Uso
                </a>
                {" "}e as{" "}
                <a
                  href="https://politicas.orpheostudio.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B894E8] hover:text-[#9B7BC8] underline font-medium"
                >
                  Políticas de Privacidade
                </a>
              </label>
            </div>

            <div className="flex gap-2 text-xs text-[#9B8BB4] dark:text-[#B894E8]">
              <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Seus dados são processados localmente. Não coletamos informações pessoais identificáveis.
                Veja nossa política completa para mais detalhes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-[#F5F0FF] to-[#FFE5EC] dark:from-[#2A2035] dark:to-[#3D2A4D] border-t-2 border-[#E8D5F5] dark:border-[#3D2A4D]">
          <Button
            onClick={onAccept}
            disabled={!termsAccepted}
            className="w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: termsAccepted 
                ? 'linear-gradient(135deg, #B894E8 0%, #FFB3C6 100%)'
                : 'linear-gradient(135deg, #E8D5F5 0%, #FFE5EC 100%)',
              color: termsAccepted ? 'white' : '#9B8BB4',
              boxShadow: termsAccepted 
                ? '0 4px 20px rgba(184, 148, 232, 0.3)'
                : 'none',
            }}
          >
            {termsAccepted ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Começar a conversar com a Sena! 💜
              </span>
            ) : (
              <span>Aceite os termos para continuar</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#2A2035] rounded-xl border border-[#E8D5F5] dark:border-[#3D2A4D] transition-all hover:shadow-md hover:scale-[1.02]">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm text-[#4A3B5C] dark:text-[#E8D5F5]">{text}</span>
    </div>
  );
}
