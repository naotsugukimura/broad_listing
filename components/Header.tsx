import { Radio } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <Radio className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Broad Listening ダッシュボード
          </h1>
          <p className="text-sm text-gray-500">
            かべなしクラウド &#x2014; SNS声分析 PoC
          </p>
        </div>
      </div>
    </header>
  );
}
