import { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Star, 
  Users, 
  Award, 
  FileText,
  BadgeAlert,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function App() {
  // Input States
  const [fixedSalary, setFixedSalary] = useState<number | string>("");
  const [mrrStart, setMrrStart] = useState<number | string>("");
  const [managedBase, setManagedBase] = useState<number | string>("");
  const [sales, setSales] = useState<number | string>("");
  const [churn, setChurn] = useState<number | string>("");
  const [opPoints, setOpPoints] = useState<number | string>("100");
  const [isBestSquad, setIsBestSquad] = useState<boolean>(false);
  const [squadMembers, setSquadMembers] = useState<number | string>("1");
  const [upsellTotal, setUpsellTotal] = useState<number | string>("");
  const [leads, setLeads] = useState<number | string>("");
  const [closedMrr, setClosedMrr] = useState<number | string>("");
  const [closedOneTimeTotal, setClosedOneTimeTotal] = useState<number | string>("");
  const [renewals, setRenewals] = useState<number | string>("");

  // Computed States
  const [nrrPercent, setNrrPercent] = useState<number>(0);
  const [nrrBonus, setNrrBonus] = useState<number>(0);
  const [nrrBonusPercent, setNrrBonusPercent] = useState<number>(0);
  const [opBonus, setOpBonus] = useState<number>(0);
  const [squadBonus, setSquadBonus] = useState<number>(0);
  const [upsellBonus, setUpsellBonus] = useState<number>(0);
  const [leadsBonus, setLeadsBonus] = useState<number>(0);
  const [closedMrrBonus, setClosedMrrBonus] = useState<number>(0);
  const [closedOneTimeBonus, setClosedOneTimeBonus] = useState<number>(0);
  const [renewalsBonus, setRenewalsBonus] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [totalPayout, setTotalPayout] = useState<number>(0);

  // Calculations
  useEffect(() => {
    const vFixedSalary = Number(fixedSalary) || 0;
    const vMrrStart = Number(mrrStart) || 0;
    const vManagedBase = Number(managedBase) || 0;
    const vSales = Number(sales) || 0;
    const vChurn = Number(churn) || 0;
    const vOpPoints = Number(opPoints) || 0;
    const vSquadMembers = Number(squadMembers) || 1;
    const vUpsellTotal = Number(upsellTotal) || 0;
    const vLeads = Number(leads) || 0;
    const vClosedMrr = Number(closedMrr) || 0;
    const vClosedOneTimeTotal = Number(closedOneTimeTotal) || 0;
    const vRenewals = Number(renewals) || 0;

    // 1. NRR Calculation
    let calcNrr = 0;
    if (vMrrStart > 0) {
      calcNrr = ((vChurn - vSales) / vMrrStart) * 100;
    }
    setNrrPercent(calcNrr);

    // 2. NRR Bonus Calculation
    let currentNrrBonusPercent = 0;
    if (calcNrr <= 5) {
      currentNrrBonusPercent = 1;
    } else if (calcNrr <= 10) {
      currentNrrBonusPercent = 0.75;
    } else if (calcNrr <= 12) {
      currentNrrBonusPercent = 0.5;
    } else {
      currentNrrBonusPercent = 0;
    }
    setNrrBonusPercent(currentNrrBonusPercent);
    const calculatedNrrBonus = (vManagedBase * currentNrrBonusPercent) / 100;
    setNrrBonus(calculatedNrrBonus);

    // 3. Operational Excellence Bonus
    let currentOpBonus = 0;
    if (vOpPoints >= 80) {
      currentOpBonus = 200;
    } else if (vOpPoints >= 50 && vOpPoints < 80) {
      currentOpBonus = 100;
    } else {
      currentOpBonus = 0; // Below 50 gets 0 (sub 20 is yellow flag)
    }
    setOpBonus(currentOpBonus);

    // 4. Other Bonuses
    const currentSquadBonus = isBestSquad && vSquadMembers > 0 ? 500 / vSquadMembers : 0;
    setSquadBonus(currentSquadBonus);

    const currentUpsellBonus = (vUpsellTotal * 15) / 100;
    setUpsellBonus(currentUpsellBonus);

    const currentLeadsBonus = Math.floor(vLeads / 10) * 50;
    setLeadsBonus(currentLeadsBonus);

    const currentClosedMrrBonus = vClosedMrr * 1000;
    setClosedMrrBonus(currentClosedMrrBonus);

    const currentClosedOneTimeBonus = (vClosedOneTimeTotal * 15) / 100;
    setClosedOneTimeBonus(currentClosedOneTimeBonus);

    const currentRenewalsBonus = vRenewals * 500;
    setRenewalsBonus(currentRenewalsBonus);

    // 5. Totals
    const sumCompt = 
      calculatedNrrBonus + 
      currentOpBonus + 
      currentSquadBonus + 
      currentUpsellBonus + 
      currentLeadsBonus + 
      currentClosedMrrBonus + 
      currentClosedOneTimeBonus + 
      currentRenewalsBonus;
    
    setTotalCommission(sumCompt);
    setTotalPayout(vFixedSalary + sumCompt);

  }, [
    fixedSalary, mrrStart, managedBase, churn, sales, opPoints, isBestSquad, squadMembers,
    upsellTotal, leads, closedMrr, closedOneTimeTotal, renewals
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const getFlagColor = (op: number, nrr: number) => {
    if (op < 20 || nrr > 12) return 'text-red-500 bg-red-50 border-red-200';
    if (nrr <= 10) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-amber-500 bg-amber-50 border-amber-200';
  };

  const InputGroup = ({ label, icon: Icon, value, onChange, type = "number", prefix = "", helpText }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '');
      if (!rawValue) {
        onChange("");
        return;
      }
      if (type === "currency") {
        onChange(parseInt(rawValue, 10) / 100);
      } else {
        onChange(parseInt(rawValue, 10));
      }
    };

    const displayValue = () => {
      if (value === "" || value === null || value === undefined) return "";
      if (type === "currency") {
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(value));
      }
      return value.toString();
    };

    return (
      <div className="flex flex-col w-full">
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          {Icon && <Icon size={14} className="text-gray-400" />} {label}
        </label>
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm font-medium">{prefix}</span>
            </div>
          )}
          <input
            type="text"
            inputMode="numeric"
            className={`block w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-gray-900 border focus:border-blue-500 shadow-sm sm:text-sm transition-colors font-medium outline-none ${prefix ? 'pl-9' : ''}`}
            value={displayValue()}
            onChange={handleChange}
            placeholder={type === "currency" ? "0,00" : "0"}
          />
        </div>
        {helpText && (
          <p className="text-[11px] text-gray-500 flex items-start gap-1 mt-1.5 leading-tight">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-70" />
            {helpText}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
              <Calculator className="text-blue-600" />
              Calculadora de Comissões
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Gestor(a) de Tráfego — AEG Media
            </p>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Valor Fixo do Gestor
            </div>
            <div className="relative w-32">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">R$</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-1.5 pl-9 pr-3 text-gray-900 border outline-none focus:border-blue-500 sm:text-sm font-bold"
                value={fixedSalary === "" ? "" : new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(fixedSalary))}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFixedSalary(rawValue ? parseInt(rawValue, 10) / 100 : "");
                }}
                placeholder="0,00"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. NRR SECTION */}
            <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingDown className="text-purple-500" size={20} />
                  Retenção & NRR
                </h2>
                <div className="text-[11px] text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Info size={12} /> Pagamentos à vista NÃO entram no NRR
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Total Gerenciado (ARR+MRR)" 
                  icon={DollarSign} 
                  type="currency"
                  prefix="R$" 
                  value={managedBase} 
                  onChange={setManagedBase} 
                  helpText="Toda a sua carteira atual. O valor financeiro do Bônus é calculado sobre ele."
                />
                <InputGroup 
                  label="MRR Início do Mês" 
                  icon={DollarSign} 
                  type="currency"
                  prefix="R$" 
                  value={mrrStart} 
                  onChange={setMrrStart} 
                  helpText="Receita do dia 1º. Usada como base para medir o % de Churn/NRR."
                />
                <InputGroup 
                  label="Vendas (Novo MRR)" 
                  icon={TrendingUp} 
                  type="currency"
                  prefix="R$" 
                  value={sales} 
                  onChange={setSales} 
                  helpText="Novo MRR vendido. Pagamentos à vista não entram."
                />
                <InputGroup 
                  label="Churn e Downgrades" 
                  icon={TrendingDown} 
                  type="currency"
                  prefix="R$" 
                  value={churn} 
                  onChange={setChurn} 
                  helpText="Receita perdida (Cancelamentos + Reduções)."
                />
              </div>

              {/* NRR STATUS BANNER */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingDown size={14} /> Desempenho do NRR %
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black tracking-tight ${nrrPercent <= 10 ? 'text-green-600' : nrrPercent > 12 ? 'text-red-500' : 'text-amber-500'}`}>
                      {nrrPercent.toFixed(2)}%
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      (Bônus Base: {nrrBonusPercent}%)
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] font-mono bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 text-gray-500 inline-block">
                    Cálculo: ((Churn - Vendas) ÷ MRR Início) × 100
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">META: ≤ 10% (Zerado = 0% perda)</div>
                </div>
                
                <div className="hidden lg:block w-px h-20 bg-gray-200"></div>
                
                <div className="flex flex-col items-start lg:items-end gap-3">
                  {nrrPercent <= 5 ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full uppercase">
                      <Star size={14} /> NRR Excelência (≤ 5%)
                    </span>
                  ) : nrrPercent <= 10 ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-full uppercase">
                      <CheckCircle2 size={14} /> Meta Atingida (≤ 10%)
                    </span>
                  ) : nrrPercent > 12 ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-red-700 bg-red-100 px-3 py-1.5 rounded-full uppercase">
                      <AlertTriangle size={14} /> Yellow Flag ({'>'} 12%)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full uppercase">
                      <AlertTriangle size={14} /> Atenção (≤ 12%)
                    </span>
                  )}
                  <div className="w-full bg-white border border-gray-100 rounded-xl p-3 shadow-sm lg:text-right">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Bônus Sobre A Base</div>
                    <div className="text-2xl font-black text-gray-900 leading-none">
                      {formatCurrency(nrrBonus)}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1.5">
                      (MRR Total × {nrrBonusPercent}%)
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. OPERATIONAL POINTS */}
            <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Star className="text-amber-400" size={20} />
                Excelência Operacional
              </h2>
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="w-full sm:w-1/3">
                  <InputGroup 
                    label="Pontuação do Mês" 
                    icon={Award} 
                    value={opPoints} 
                    onChange={setOpPoints} 
                    min="0"
                    helpText="Baseado em: Verba investida, Respostas a clientes, Checkpoints e Relatórios."
                  />
                </div>
                <div className="flex-1 w-full bg-gray-50 rounded-2xl p-5 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Faixa de Bônus da Recompensa</div>
                    <div className="text-sm font-semibold mt-1">
                      {opPoints >= 80 ? '⭐ Excelência Opr (80-100 pts) = R$ 200' : 
                       opPoints >= 50 ? '✅ Bom Desempenho (50-80 pts) = R$ 100' : 
                       '⚠️ Yellow Flag Operacional (< 20 pts) = R$ 0'}
                    </div>
                  </div>
                  <div className="text-right pl-4 border-l border-gray-200">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Valor Bônus</div>
                    <div className={`text-xl font-bold mt-0.5 ${opPoints < 20 ? 'text-red-500' : 'text-gray-900'}`}>
                      {formatCurrency(opBonus)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. ADDITIONAL COMMISSIONS */}
            <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Award className="text-blue-500" size={20} />
                Comissões Operacionais
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Squad do mês */}
                <div className="space-y-1.5 w-full">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Users size={14} className="text-gray-400" /> Melhor Squad do Mês
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsBestSquad(!isBestSquad)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        isBestSquad 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      {isBestSquad ? 'Sim' : 'Não'}
                    </button>
                    {isBestSquad && (
                      <div className="w-24">
                        <InputGroup 
                          label="" 
                          value={squadMembers} 
                          onChange={setSquadMembers} 
                          min="1" 
                          icon={null}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-start gap-1 mt-1.5 leading-tight">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-70" />
                    Bônus: R$ 500 dividido pelos membros do squad
                  </p>
                </div>

                {/* Upsell/Cross-sell */}
                <InputGroup 
                  label="Upsell / Cross-Sell" 
                  icon={TrendingUp} 
                  type="currency"
                  prefix="R$" 
                  value={upsellTotal} 
                  onChange={setUpsellTotal} 
                  helpText="Bônus: 15% do valor do 1º pagamento"
                />

                {/* Indicação fechada MRR */}
                <InputGroup 
                  label="Contrato recorrente fechado por indicação" 
                  icon={FileText} 
                  value={closedMrr} 
                  onChange={setClosedMrr} 
                  helpText="Bônus: R$ 1.000,00 por contrato"
                />

                {/* Indicação fechada One Time */}
                <InputGroup 
                  label="Pagamento one time (Total 1º Pag)" 
                  icon={DollarSign} 
                  type="currency"
                  prefix="R$" 
                  value={closedOneTimeTotal} 
                  onChange={setClosedOneTimeTotal} 
                  helpText="Bônus: 15% do 1º pagamento por contrato avulso"
                />

                {/* Leads / Indicações */}
                <InputGroup 
                  label="Indicações Captadas no Mês (Qtd)" 
                  icon={Users} 
                  value={leads} 
                  onChange={setLeads} 
                  helpText="Bônus: R$ 50,00 a cada bloco de 10 indicações"
                />

                {/* Renovações */}
                <InputGroup 
                  label="Renovações Concluídas (Qtd)" 
                  icon={CheckCircle2} 
                  value={renewals} 
                  onChange={setRenewals} 
                  helpText="Bônus: R$ 500,00 por renovação concluída"
                />

              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Total Calculation Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#111214] rounded-3xl p-6 text-white shadow-2xl sticky top-8">
              <h3 className="text-[13px] font-bold text-gray-400 mb-6 uppercase tracking-[0.15em] text-center border-b border-gray-800 pb-4">
                Recibo de Pagamento
              </h3>

              <div className="space-y-4 mb-8 text-[13px]">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Valor Fixo</span>
                  <span className="font-mono text-white text-sm">{formatCurrency(fixedSalary)}</span>
                </div>
                
                <div className="h-px bg-gray-800 my-2"></div>
                
                <div className="flex justify-between items-center text-[#F27D26] font-medium">
                  <span>Bônus NRR ({nrrBonusPercent}%)</span>
                  <span className="font-mono">{formatCurrency(nrrBonus)}</span>
                </div>
                <div className="flex justify-between items-center text-[#F27D26] font-medium">
                  <span>Excelência Operacional</span>
                  <span className="font-mono">{formatCurrency(opBonus)}</span>
                </div>
                
                <div className="h-px bg-gray-800 my-2"></div>

                {squadBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Melhor Squad (Divisão)</span>
                    <span className="font-mono">{formatCurrency(squadBonus)}</span>
                  </div>
                )}
                {upsellBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Upsell/Cross (15%)</span>
                    <span className="font-mono">{formatCurrency(upsellBonus)}</span>
                  </div>
                )}
                {leadsBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Indicações ({Math.floor(leads/10)} blocos)</span>
                    <span className="font-mono">{formatCurrency(leadsBonus)}</span>
                  </div>
                )}
                {closedMrrBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Contrato Indicação</span>
                    <span className="font-mono">{formatCurrency(closedMrrBonus)}</span>
                  </div>
                )}
                {closedOneTimeBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>One Time Indicação</span>
                    <span className="font-mono">{formatCurrency(closedOneTimeBonus)}</span>
                  </div>
                )}
                {renewalsBonus > 0 && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Renovações</span>
                    <span className="font-mono">{formatCurrency(renewalsBonus)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center font-bold pt-4 text-sm mt-4 border-t border-gray-800">
                  <span className="text-gray-400">Total de Comissões</span>
                  <span className="font-mono text-blue-400">{formatCurrency(totalCommission)}</span>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-gray-800/80 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 text-center">
                  Total a Receber (Bruto)
                </div>
                <div className="text-4xl font-black text-center text-white font-mono tracking-tighter">
                  {formatCurrency(totalPayout)}
                </div>
                {opPoints < 20 && (
                  <div className="mt-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs text-center py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                    <BadgeAlert size={14} /> Flag Operacional Aplicada
                  </div>
                )}
                {nrrPercent > 12 && (
                  <div className="mt-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs text-center py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                    <BadgeAlert size={14} /> Flag de NRR Aplicada
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
