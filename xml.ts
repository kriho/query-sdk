
import * as xpath from "xpath"
import { parseNumber } from "./utils";

export function resolveAttribute(name: string, context: Node) {
  if(context.nodeType == context.ELEMENT_NODE) {
    return (<Element>context).getAttribute(name);
  }
  return null;
}

export function resolveNumericAttribute(name: string, context: Node) {
  const value = resolveAttribute(name, context);
  if(value == null) {
    return null;
  }
  return parseNumber(value);
}

export function resolveTextContent(context: Node) {
  if(context.nodeType == context.ELEMENT_NODE) {
    return (<Element>context).textContent;
  }
  return null;
}

export function resolveNumericTextContent(context: Node) {
  const value = resolveTextContent(context);
  if(value == null) {
    return null;
  }
  return parseNumber(value);
}

export function find<T extends xpath.SelectedValue>(path: string, context: Node): T {
  const result = xpath.select1(path, context);
  if (result == null) {
    return null;
  } else {
    return result as T;
  }
}

export function search<T extends xpath.SelectedValue>(path: string, context: Node): T[] {
  const results = xpath.select(path, context);
  if (results == null) {
    return [];
  } else if (results instanceof Array) {
    return results as T[];
  } else {
    return [results];
  }
}

export function textContent(node: Node) {
  var text = "";
  for (let index = 0; index < node.childNodes.length; index++) {
    var childNode = node.childNodes.item(index);
    if (childNode.nodeType == childNode.TEXT_NODE) {
      text += childNode.textContent;
    }
  }
  return text.trim();
}

export async function drilldown(context: Node, path: string, handler: (context: Node) => void) {
  let anchor = xpath.select1(path, context) as Node;
  if (anchor) {
    handler(anchor);
  }
}

export function getTextContentUnilNextElement(context: Node, nextElementName: string) {
  const segments: string[] = [];
  let nextNode = context.nextSibling;
  while (nextNode != null && (nextNode.nodeType != nextNode.ELEMENT_NODE || nextNode.nodeName != nextElementName)) {
    if (nextNode.nodeType == nextNode.TEXT_NODE) {
      if (nextNode.textContent.startsWith("[") || nextNode.textContent.startsWith("---") || nextNode.textContent.startsWith("Quelle:")) {
        break;
      }
      segments.push(nextNode.nodeValue.trim());
    }
    nextNode = nextNode.nextSibling;
  }
  return segments.filter(s => s).join("\n");
}