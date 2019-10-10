var win=Ti.UI.createWindow({
title:"Deutsche Nationalbibliothek",
backgroundImage:"/assets/images/default.png"});global.win =win;

var abx=require("com.alcoapps.actionbarextras");global.abx =abx;
var Spinner=require("spinner")();global.Spinner =Spinner;
var searchView=Ti.UI.Android.createSearchView({
hintText:"Suche \u2026",
top:0});global.searchView =searchView;

var query="";global.query =query;
var nextRecord=0;global.nextRecord =nextRecord;
var loading=!1;global.loading =loading;
const onLoad=function(e){
loading||
win.remove(Spinner),
loading=!1;
const response=e.searchRetrieveResponse;





if(nextRecord=response.nextRecordPosition,Ti.UI.createNotification({message:response.nextRecordPosition-1+"/"+response.numberOfRecords+" Treffer",duration:3e3}).show(),!response.records.record||!response.records.record.list)


return console.log(">>>>>>>>>>>"),void listView.clearAllSections();

const items=response.records.record.list.map(function(record){
const data=record.recordData.dc;
var creator="";
data["dc:creator"]&&"string"==typeof data["dc:creator"]?
creator=data["dc:creator"]:
data["dc:creator"]&&Array.isArray(data["dc:creator"].list)&&(
creator=data["dc:creator"].list.join(", "));
const item={
title:{
text:data["dc:title"]},

publisher:{
text:data["dc:publisher"]?data["dc:publisher"]+",  "+data["dc:date"]:data["dc:date"]},

creator:{
text:creator},

properties:{
itemId:JSON.stringify(data),
accessoryType:Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE}};


return item;
});
listView.addSection(items),
listView.backgroundColor="white";
};global.onLoad =onLoad,

win.add(searchView);
var listView=require("listview")();global.listView =listView,
win.add(listView),

searchView.addEventListener("submit",function(){
listView.clearAllSections(),
menuItem.collapseActionView(),
query=searchView.getValue(),
abx.setSubtitle("Suche nach \u201E"+query+"\u201C"),
win.add(Spinner),
DNB.searchretrieve({
query:query,
maximumRecords:100},
onLoad);
}),

searchView.addEventListener("submit",function(){
win.add(Spinner),
menuItem.collapseActionView(),
query=searchView.getValue(),
abx.setSubtitle("Suche nach \u201E"+query+"\u201C"),
DNB.searchretrieve({
query:query,
maximumRecords:100},
onLoad);
}),
listView.addEventListener("itemclick",function(e){
console.log(e.itemId);
}),

listView.addEventListener("scrollend",function(e){
if(!0==loading)
return;const
ndx=e.visibleItemCount+e.firstVisibleItemIndex,
section=e.firstVisibleSectionIndex;
console.log("ndx="+ndx+"  "+section+"    "+ndx%100),(
50<ndx%100||0==ndx)&&(

loading=!0,
DNB.searchretrieve({
query:query,
maximumRecords:100,
startRecord:nextRecord},
onLoad));

}),

win.open();

const DNB=require("de.appwerft.sru").createEndpoint({
url:"https://services.dnb.de/sru",
version:"1.1",
catalog:"dnb",
recordSchema:"oai_dc",
accesstoken:require(".accesstoken"),
explained:function(e){
}});global.DNB =DNB,


abx.setStatusbarColor("#D6CC50"),
abx.setBackgroundColor("#2E7CBD"),
abx.subtitle="Suche im Gesamtbestand";

var menuItem;global.menuItem =menuItem,
win.activity.onCreateOptionsMenu=function(e){
abx.setStatusbarColor("#D6CC50"),
abx.setBackgroundColor("#2E7CBD"),
abx.subtitle="Suche im Gesamtbestand";
var menu=e.menu;
menuItem=menu.add({
title:"Suche",
actionView:searchView,
icon:"/assets/images/lupe.png",
showAsAction:Ti.Android.SHOW_AS_ACTION_IF_ROOM|Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW});

};