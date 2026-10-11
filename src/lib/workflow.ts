const website = {
  title: "A website inquiry",
  steps: [
    {
      label: "Receive",
      text: "A sample inquiry arrives through a website form.",
    },
    {
      label: "Route",
      text: "Send it to the right person, based on what is needed.",
    },
    {
      label: "Record",
      text: "Keep the details together, ready for a conversation.",
    },
    {
      label: "Notify",
      text: "Let the team know there is a new inquiry to review.",
    },
  ],
};
const followUp = {
  title: "A follow-up request",
  steps: [
    {
      label: "Receive",
      text: "A sample follow-up request enters the workflow.",
    },
    {
      label: "Prioritize",
      text: "An existing conversation takes a different route.",
    },
    { label: "Update", text: "Add the request to its existing record." },
    {
      label: "Notify",
      text: "Bring the context back to the right team member.",
    },
  ],
};
export function workflowFor(scenario: string) {
  return scenario === "follow-up" ? followUp : website;
}
