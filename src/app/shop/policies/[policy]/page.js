import Shopify from "@/shopify";
import { toCamelCase } from "@/utils";

export default async function PolicyPage({ params }) {
  const { policy: policyHandle } = await params;
  const policyName = toCamelCase(policyHandle);
  const policies = await Shopify.getPolicies();
  const policy =
    policies[policyName] ||
    Object.values(policies).find(({ handle }) => handle === policyHandle);

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-7xl p-4">404</h1>
        <div className="text-center font-sans text-2xl p-4">
          This page could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/75 p-2 md:p-4">
      <h1 className="text-3xl text-yellow-300 mb-4 text-shadow-lg">
        {policy.title}
      </h1>
      <div
        className="font-sans"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </div>
  );
}
