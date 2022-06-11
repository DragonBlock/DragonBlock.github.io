// JavaScript source code

//#region Keyboard Support

// Adds Event and Flags to use keyboard for starting screen.
document.addEventListener('keypress', startWithKeys);
var startedWithKeys = false;
var started = false;

/**
 * Keyboard Event to Start Game with 'A' or 'Enter' keys.
 * @param {*} e - Keyboard Event Args
 */
function startWithKeys(e) {
    if (!started) {
        if (e.code == "KeyA" || e.code == "Enter") StartGame();
        startedWithKeys = true;
        started = true;
    }
}

// Adds an Event and Flag that provides keyboard functionality to fighting menu.
document.addEventListener('keypress', fightWithKeys);

var fighting = false;
/**
 * Keyboard Event for fighting menu.
 * 'A':(Attack), 'D':(Defend), 'C':(Counter), 'E':(AttackInv), 'Q':(SpellInv)
 * @param {*} e - Keyboard Event Args
 */
function fightWithKeys(e) {
    if (fighting) {
        if (e.code == "KeyA" || e.code == "Enter") Attack("Attack");
        else if (e.code == "KeyD") Attack("Defend");
        else if (e.code == "KeyC") Attack("Counter");
        else if (e.code == "KeyE") OpenAttackInventory();
        else if (e.code == "KeyQ") OpenSpellInventory();
    }
}

// Adds an Event and Flag that provides keyboard functionality to the main menu.
document.addEventListener('keypress', menuWithKeys);

var onMenu = false;

/**
 * Keyboard Event for main menu.
 * 'A':(NextRnd), 'S':(Shop), 'E':(Inv), 'Q':(MagicShop)
 * @param {*} e - Keyboard Event Args
 */
function menuWithKeys(e) {
    if (startedWithKeys) {
        startedWithKeys = false;
    }
    else if (onMenu) {
        if (e.code == "KeyA" || e.code == "Enter") StartNextRound();
        else if (e.code == "KeyS") ShowShop();
        else if (e.code == "KeyE") LoadInventory();
        else if (e.code == "KeyQ") OpenMagic();
    }
}

// Adds an Event and Flags that provide keyboard functionality to the after battle resolution screen.
document.addEventListener('keypress', resolutionWithKeys);

var onResolution = false;
// Add this to delay function by one iteration
var battleEnded = false;

/**
 * Keyboard Event for resolution screen.
 * Requires 'A' or 'Enter' to be pressed twice to continue.
 * @param {*} e - Keyboard Event Args
 */
function resolutionWithKeys(e) {
    if (battleEnded) battleEnded = false;
    else if (onResolution && !fighting) {
        if (e.code == "KeyA" || e.code == "Enter") BackToMenu();
    }
}
//#endregion

//#region Player Setup
// Defines player starting stats
var pMaxHealth = 100;
var pHealth = 100;
var pStatus = "None";
var pLevel = 1;
var pExp = 0;
var expToLvUp = 0;
var pStrength = 1;
var pToughness = 1;
var pAgility = 1;
var pMana = 10;
var pMaxMana = 10;
var pGold = 0;

var difficulty = 0;
var round = 1;


// Defines player starting inventory
var pWeaponStorage = 3;
var pArmorStorage = 3;
var pItemStorage = 5;
var pWeaponEquipped = { name: "Fists", type: "Two-Handed", damage: 1, speed: 3, enchantment: "none", modifier: "none", durability: -1 };
var pArmorEquipped = { name: "Ragged Clothes", weight: "None", defense: 1, enchantment: "none", modifier: "none", durability: -1 };
var pWeapons = [{ name: "Fists", type: "Two-Handed", damage: 1, speed: 3, enchantment: "none", modifier: "none", durability: -1 }];
var pArmor = [{ name: "Ragged Clothes", weight: "None", defense: 1, enchantment: "none", modifier: "none", durability: -1 }];
var pItems = [];
var pUseItem = {};
var pMagics = [];
var pUseSpell = {};
//#endregion

//#region Game Setup
// Define all weapons and armor
var Weapons = [{ name: "Wooden Sword", type: "Two-Handed", damage: 2, speed: 2, enchantment: "none", modifier: "none", durability: 100, cost: 50 },
{ name: "Broken Sword", type: "Two-Handed", damage: 3, enchantment: "none", speed: 3, modifier: "none", durability: 100, cost: 100 },
{ name: "Rusty Sword", type: "Two-Handed", damage: 4, enchantment: "none", speed: 1, modifier: "none", durability: 100, cost: 150 }];

var Armor = [{ name: "Leather Armor", weight: "None", defense: 2, enchantment: "none", modifier: "none", durability: 100, cost: 300 },
{ name: "Hardened Leather Armor", weight: "Light", defense: 3, enchantment: "none", modifier: "none", durability: 100, cost: 500 },
{ name: "Chainmail Armor", weight: "Medium", defense: 5, enchantment: "none", modifier: "none", durability: 100, cost: 700 }];

// Define Magic, Status effects, and items
var Magic = [{ name: "Flame Shot", type: "status", damage: 5, statusEffect: "Burned", manaCost: 5, cost:150, desc:"Has a chance to burn the enemy it hits.", effectChance: 5 },
{ name: "Zap Bolt", type: "damage", damage: 40, statusEffect: "none", manaCost: 10, cost:300, desc:"Zaps enemies for significant damage.", effectChance: 0 },
{ name: "Healing Ring", type: "heal", heal: 100, statusEffect: "none", manaCost: 15, cost:750, desc:"Heals a significant amount of damage.", effectChance: 0 },
{ name: "Instant Death", type: "damage", damage: 100000, statusEffect: "none", manaCost: 50, cost:1000, desc:"Instantly kills any enemy.", effectChance: 0 }];

// Ideas only
// var statusEffects = [{ name: "Burned", damage:"1/16" }, { name: "Poisoned", damage:"1/8" }];

var Items = [{ name: "Small Health Potion", cost: 20, heal: 15, type: "heal", enchantment: "none", modifier: "none" },
{ name: "Health Potion", cost: 50, heal: 30, type: "heal", enchantment: "none", modifier: "none" },
{ name: "Large Health Potion", cost: 85, heal: 50, type: "heal", enchantment: "none", modifier: "none" }/*,
{name:"Health Crystal", cost:150, health:10, type:"health", enchantment:"none", modifier:"none"},
{name:"Health Boost Potion", cost:300, hboost:30, turns:2, type:"hboost", enchantment:"none", modifier:"none"}*/,
{ name: "Small Mana Potion", cost: 35, mana: 8, type: "mana", enchantment: "none", modifier: "none" },
{ name: "Mana Potion", cost: 80, mana: 20, type: "mana", enchantment: "none", modifier: "none" },
{ name: "Large Mana Potion", cost: 175, mana: 50, type: "mana", enchantment: "none", modifier: "none" }];


// Define all Monsters
var Monsters = [{ name: "Slime", baseHealth: 20, maxHealth: 20, health: 20, baseStrength: 1, strength: 1, baseSpeed: 1, speed: 1, drop: "", itemChance: 0, goldDrop: 10, minRecLevel: 1, nature: "none", specialChance: 25, hitEffect: "none", effectChance: 0 },
{ name: "Goblin", baseHealth: 35, maxHealth: 35, health: 35, baseStrength: 2, strength: 2, baseSpeed: 3, speed: 3, drop: "", itemChance: 0, goldDrop: 25, minRecLevel: 2, nature: "none", specialChance: 20, hitEffect: "none", effectChance: 0 },
{ name: "Zombie", baseHealth: 45, maxHealth: 45, health: 45, baseStrength: 4, strength: 4, baseSpeed: 1, speed: 1, drop: "", itemChance: 0, goldDrop: 30, minRecLevel: 3, nature: "none", specialChance: 15, hitEffect: "none", effectChance: 0 },
{ name: "Skeleton Archer", baseHealth: 50, maxHealth: 50, health: 50, baseStrength: 4, strength: 4, baseSpeed: 5, speed: 5, drop: "", itemChance: 0, goldDrop: 35, minRecLevel: 4, nature: "none", specialChance: 12, hitEffect: "none", effectChance: 0 },
{ name: "Skeleton Warrior", baseHealth: 60, maxHealth: 60, health: 60, baseStrength: 6, strength: 6, baseSpeed: 2, speed: 2, drop: "", itemChance: 0, goldDrop: 45, minRecLevel: 5, nature: "none", specialChance: 10, hitEffect: "none", effectChance: 0 },
{ name: "Giant Spider", baseHealth: 65, maxHealth: 65, health: 65, baseStrength: 5, strength: 5, baseSpeed: 8, speed: 8, drop: "", itemChance: 0, goldDrop: 55, minRecLevel: 6, nature: "none", specialChance: 8, hitEffect: "Poisoned", effectChance: 2},
{ name: "Ogre", baseHealth: 80, maxHealth: 80, health: 80, baseStrength: 8, strength: 8, baseSpeed: 3, speed: 3, drop: "", itemChance: 0, goldDrop: 65, minRecLevel: 7, nature: "none", specialChance: 7, hitEffect: "none", effectChance: 0 },
{ name: "Pack of Wolves", baseHealth: 85, maxHealth: 85, health: 85, baseStrength: 8, strength: 8, baseSpeed: 10, speed: 10, drop: "", itemChance: 0, goldDrop: 80, minRecLevel: 8, nature: "none", specialChance: 6, hitEffect: "none", effectChance: 0 },
{ name: "Shadow Knight", baseHealth: 95, maxHealth: 95, health: 95, baseStrength: 12, strength: 12, baseSpeed: 5, speed: 5, drop: "", itemChance: 0, goldDrop: 100, minRecLevel: 9, nature: "none", specialChance: 5, hitEffect: "none", effectChance: 0 },
{ name: "Shadow Assassin", baseHealth: 105, maxHealth: 100, health: 100, baseStrength: 10, strength: 10, baseSpeed: 10, speed: 10, drop: "", itemChance: 0, goldDrop: 120, minRecLevel: 10, nature: "none", specialChance: 4, hitEffect: "none", effectChance: 0 },
{ name: "Shadow Leader", baseHealth: 150, maxHealth: 150, health: 150, baseStrength: 15, strength: 15, baseSpeed: 8, speed: 8, drop: "", itemChance: 0, goldDrop: 150, minRecLevel: 11, nature: "none", specialChance: 3, hitEffect: "none", effectChance: 0 },
{ name: "Demon", baseHealth: 300, maxHealth: 300, health: 300, baseStrength: 20, strength: 20, baseSpeed: 15, speed: 15, drop: "", itemChance: 0, goldDrop: 250, minRecLevel: 100, nature: "none", specialChance: 2, hitEffect: "none", effectChance: 0 },
{ name: "Dragon", baseHealth: 500, maxHealth: 500, health: 500, baseStrength: 30, strength: 30, baseSpeed: 20, speed: 20, drop: "", itemChance: 0, goldDrop: 400, minRecLevel: 200, nature: "none", specialChance: 1, hitEffect: "none", effectChance: 0 },
{ name: "Titan", baseHealth: 1000, maxHealth: 1000, health: 1000, baseStrength: 50, strength: 50, baseSpeed: 10, speed: 10, drop: "", itemChance: 0, goldDrop: 750, minRecLevel: 300, nature: "none", specialChance: 1, hitEffect: "none", effectChance: 0 }];

var MonsterDrops = [{}];

var currentMonster;
//#endregion

//#region Show/Hide Functions

// Functions used to switch screens/what is being displayed
function ShowMainGame() {
    document.getElementById("maingame").style.display = "inline";
}
function HideMainGame() {
    document.getElementById("maingame").style.display = "none";
}
function ShowMenu() {
    document.getElementById("menu").style.display = "inline";
}
function HideMenu() {
    document.getElementById("menu").style.display = "none";
}
function ShowFighting() {
    document.getElementById("fighting").style.display = "inline";
}
function HideFighting() {
    document.getElementById("fighting").style.display = "none";
}

// Later implemented generic show/hide functions
function ShowElementByID(ID) {
    document.getElementById(ID).style.display = "inline";
}
function HideElementByID(ID) {
    document.getElementById(ID).style.display = "none";
}

/**
 * Shows shop interface
 */
 function ShowShop() {
    HideElementByID("menu");
    ShowElementByID("shop");
    ShowElementByID("shopmenu");
    HideElementByID("buy");
    HideElementByID("sell");
    HideElementByID("transaction");

    onMenu = false;
}

/**
 * Shows help
 */
function ShowHelp()
{
    HideElementByID("menu");
    ShowElementByID("help");

    onMenu = false;
}

/**
 * Hides help
 */
 function HideHelp()
 {
     HideElementByID("help");
     ShowElementByID("menu");
 
     onMenu = true;
 }

//#endregion


/**
 * Starts game and updates all relevant flags
 */
 function StartGame() {
    document.getElementById("start").style.display = "none";

    expToLvUp = 210;

    ShowMainGame();
    UpdateMenuStatus();
    started = true;
    onMenu = true;
}

//#region Menu Functions
function BackToMenu() {
    HideElementByID("resolution");
    HideElementByID("shop");
    HideElementByID("inventory");
    HideElementByID("magic");
    ShowElementByID("menu");

    onMenu = true;

    onResolution = false;
    battleEnded = false;

    UpdateMenuStatus();
}

function UpdateMenuStatus() {
    document.getElementById("menustatus").innerHTML = "You are on Round " + round + "<br>You are Level " + pLevel + "<br>You have " + pGold + " gold";
}
//#endregion

//#region Shop Functions

/**
 *  Sets up buying menu
 */
function LoadBuying() {
    HideElementByID("shopmenu");
    ShowElementByID("buy");
    var itemsToBuy = document.getElementById("buy");
    itemsToBuy.innerHTML = "";
    for (var i = 0; i < Weapons.length; i++) {
        itemsToBuy.innerHTML +=
            "<button onclick=\"Buy('" + Weapons[i].name + "', 'Weapon')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + Weapons[i].name + "<br>" + Weapons[i].cost + " Gold</button>";
        if (i == 4) itemsToBuy.innerHTML += "<br>";
    }
    itemsToBuy.innerHTML += "<br>"
    for (var c = 0; c < Armor.length; c++) {
        itemsToBuy.innerHTML +=
            "<button onclick=\"Buy('" + Armor[c].name + "', 'Armor')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + Armor[c].name + "<br>" + Armor[c].cost + " Gold</button>";
        if (c == 4) itemsToBuy.innerHTML += "<br>";
    }
    itemsToBuy.innerHTML += "<br>"
    for (var c = 0; c < Items.length; c++) {
        var itemTxt = "<button onclick=\"Buy('" + Items[c].name + "', 'Item')\" style=\"height:60px;width:140px;vertical-align:middle;\">";
        if(Items[c].type == "mana") itemTxt += "("+ Items[c].mana  +" MP)<br>";
        else if(Items[c].type == "heal") itemTxt +="("+ Items[c].heal  +" HP)<br>";
        itemTxt += Items[c].name + "<br>" + Items[c].cost + " Gold</button>";
        itemsToBuy.innerHTML += itemTxt;
        if (c == 2) itemsToBuy.innerHTML += "<br>";
    }
    itemsToBuy.innerHTML += "<br><br><div class=\"center\"><button onclick=\"BackToMenu()\">Exit</button></div>"
}
 
// Buying function
function Buy(item, type) {
    var fullInventory;
    var itemToBuy;
    var owned;
    var notEnoughGold;

    //document.getElementById("buy").innerHTML += item;

    if (type == "Weapon") {
        for (var c = 0; c < pWeapons.length; c++) {
            if (pWeapons[c] != null && item == pWeapons[c].name) {
                owned = true;
                break;
            }
        }

        var numOfWeapons = 0;
        for (var i = 0; i < pWeapons.length; i++) {
            if (pWeapons[i] != null) numOfWeapons++;
        }

        if (pWeaponStorage <= numOfWeapons) {
            fullInventory = true;
        }
        else if (!owned) {
            for (var i = 0; i < Weapons.length; i++) {
                if (item == Weapons[i].name) {
                    itemToBuy = Weapons[i];
                    break;
                }
            }

            if (itemToBuy.cost <= pGold) {
                pGold -= itemToBuy.cost;
                pWeapons[pWeapons.length] = itemToBuy;
                Receipt(itemToBuy.name, itemToBuy.cost, "Weapon", "bought");
            }
            else notEnoughGold = true;


        }
    }
    else if (type == "Armor") {
        for (var c = 0; c < pArmor.length; c++) {
            if (pArmor[c] != null && item == pArmor[c].name) {
                owned = true;
                break;
            }
        }

        var numOfArmors = 0;
        for (var i = 0; i < pArmor.length; i++) {
            if (pArmor[i] != null) numOfArmors++;
        }

        if (pArmorStorage <= numOfArmors) {
            fullInventory = true;
        }
        else if (!owned) {
            for (var i = 0; i < Armor.length; i++) {
                if (item == Armor[i].name) {
                    itemToBuy = Armor[i];
                    break;
                }
            }

            if (itemToBuy.cost <= pGold) {
                pGold -= itemToBuy.cost;
                pArmor[pArmor.length] = itemToBuy;
                Receipt(itemToBuy.name, itemToBuy.cost, "Armor", "bought");
            }
            else notEnoughGold = true;


        }
    }
    else if (type == "Item") {

        var numOfItems = 0;
        for (var i = 0; i < pItems.length; i++) {
            if (pItems[i] != null) numOfItems++;
        }

        if (pItemStorage <= numOfItems) {
            fullInventory = true;
        }
        else if (!owned) {
            for (var i = 0; i < Items.length; i++) {
                if (item == Items[i].name) {
                    itemToBuy = Items[i];
                    break;
                }
            }

            if (itemToBuy.cost <= pGold) {
                pGold -= itemToBuy.cost;
                pItems[pItems.length] = itemToBuy;
                Receipt(itemToBuy.name, itemToBuy.cost, "Item", "bought");
            }
            else notEnoughGold = true;


        }
    }

    if (fullInventory) {
        ShopErrorMessage("Your inventory is full");
    }
    else if (owned) {
        ShopErrorMessage("You already own this item");
    }
    else if (notEnoughGold) {
        ShopErrorMessage("You don't have enough gold for this item");
    }

}

/**
 *  Sets up selling menu
 */
function LoadSelling() {
    HideElementByID("shopmenu");
    ShowElementByID("sell");
    var itemsToSell = document.getElementById("sell");
    itemsToSell.innerHTML = "";

    for (var i = 0; i < pWeapons.length; i++) {
        if (pWeapons[i] != null && pWeapons[i].name != "Fists" && pWeapons[i].name != pWeaponEquipped.name) {
            itemsToSell.innerHTML +=
                "<button onclick=\"Sell('" + pWeapons[i].name + "', 'Weapon')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + pWeapons[i].name + "<br>" + pWeapons[i].cost / 5 + " Gold</button>";
        }
    }
    itemsToSell.innerHTML += "<br>"
    for (var c = 0; c < pArmor.length; c++) {
        if (pArmor[c] != null && pArmor[c].name != "Ragged Clothes" && pArmor[c].name != pArmorEquipped.name) {
            itemsToSell.innerHTML +=
                "<button onclick=\"Sell('" + pArmor[c].name + "', 'Armor')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + pArmor[c].name + "<br>" + pArmor[c].cost / 5 + " Gold</button>";

        }
    }
    itemsToSell.innerHTML += "<br>"
    for (var c = 0; c < pItems.length; c++) {
        if (pItems[c] != null) {
            itemsToSell.innerHTML +=
                "<button onclick=\"Sell('" + pItems[c].name + "', 'Item')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + pItems[c].name + "<br>" + pItems[c].cost / 5 + " Gold</button>";

        }
    }

    itemsToSell.innerHTML += "<br><br><div class=\"center\"><button onclick=\"BackToMenu()\">Exit</button></div>";
}

// Selling function
function Sell(item, type) {
    var itemToSell;

    //document.getElementById("buy").innerHTML += item;

    if (type == "Weapon") {

        for (var i = 0; i < pWeapons.length; i++) {
            if (pWeapons[i].name != null && item == pWeapons[i].name) {
                itemToSell = i;
                break;
            }
        }

        pGold += pWeapons[itemToSell].cost / 5;
        Receipt(pWeapons[itemToSell].name, pWeapons[itemToSell].cost / 5, "Weapon", "sold");
        pWeapons[itemToSell] = null;
    }
    else if (type == "Armor") {

        for (var i = 0; i < pArmor.length; i++) {
            if (pArmor[i].name != null && item == pArmor[i].name) {
                itemToSell = i;
                break;
            }
        }

        pGold += pArmor[itemToSell].cost / 5;
        Receipt(pArmor[itemToSell].name, pArmor[itemToSell].cost / 5, "Armor", "sold");
        pArmor[itemToSell] = null;
    }
    else if (type == "Item") {

        for (var i = 0; i < pItems.length; i++) {
            if (pItems[i] != null && item == pItems[i].name) {
                itemToSell = i;
                break;
            }
        }

        pGold += pItems[itemToSell].cost / 5;
        Receipt(pItems[itemToSell].name, pItems[itemToSell].cost / 5, "Item", "sold");
        pItems[itemToSell] = null;
    }
}

/**
 *  Shows player result of transaction
 */
function Receipt(itemName, amount, itemType, transactionType) {
    HideElementByID("buy");
    HideElementByID("sell");
    HideElementByID("magic");
    ShowElementByID("transaction");

    var receipt = document.getElementById("transaction");

    receipt.innerHTML = "<p>You " + transactionType + " a " + itemName + " for " + amount + " gold<br>";

    if ((itemType == "Weapon" || itemType == "Armor") && transactionType == "bought") {
        receipt.innerHTML += "Do you want to equip it now?</p><button onclick=\"Equip('" + itemName +
            "')\">Yes</button><button onclick=\"BackToMenu()\">No</button>";

    }
    else {
        receipt.innerHTML += "<button onclick=\"BackToMenu()\">Okay</button>";
    }
}

// Shows Shop Error to player
function ShopErrorMessage(error) {
    alert(error);
}

//#endregion

//#region Inventory/Equip

/**
 *  Shows inventory
 */
 function LoadInventory() {
    HideElementByID("menu");
    ShowElementByID("inventory");

    onMenu = false;

    inventory = document.getElementById("inventory");

    var weaponEntry = "<div style=\"clear: left; float: left; width: 50%;\"><ol>";

    for (var i = 0; i < pWeapons.length; i++) {
        if (pWeapons[i] != null) {
            weaponEntry += "<li style=\"cursor: pointer; list-style-type: none; text-align:left;";
            if (pWeaponEquipped.name == pWeapons[i].name) weaponEntry += "color: Red; text-decoration: underline overline;";
            else weaponEntry += "color: Blue; text-decoration: underline;";
            weaponEntry += "\"><a onclick=\"Equip('" + pWeapons[i].name + "')\">" + pWeapons[i].name + "</a></li>";
        }
    }

    weaponEntry += "</ol></div>";

    inventory.innerHTML = weaponEntry;

    var armorEntry = "<div style=\"clear: right; float: right; width: 50%;\"><ol>";

    for (var i = 0; i < pArmor.length; i++) {
        armorEntry += "<li style=\"cursor: pointer; list-style-type: none; text-align:right;";
        if (pArmorEquipped.name == pArmor[i].name) armorEntry += "color: Red; text-decoration: underline overline;";
        else armorEntry += "color: Blue; text-decoration: underline;";
        armorEntry += "\"><a onclick=\"Equip('" + pArmor[i].name + "')\">" + pArmor[i].name + "</a></li>";
    }
    armorEntry += "</ol></div><br><br><br>";

    inventory.innerHTML += armorEntry;

    inventory.innerHTML += "<div class=\"center\" style=\"display:block; width:100%;\"><button onclick=\"BackToMenu()\">Exit</button></div>";
}

// Equip Weapon/Armor
function Equip(iName) {
    for (var i = 0; i < pWeapons.length; i++) {
        if (pWeapons[i] != null && iName == pWeapons[i].name) {
            pWeaponEquipped = pWeapons[i];
            break;
        }
    }
    for (var i = 0; i < pArmor.length; i++) {
        if (pArmor[i] != null && iName == pArmor[i].name) {
            pArmorEquipped = pArmor[i];
            break;
        }
    }
    BackToMenu();
}

//#endregion

//#region Magic/Spell Purchasing

function OpenMagic() {
    HideElementByID("menu");
    ShowElementByID("magic");

    onMenu = false;
    
    var magicDisplay = document.getElementById("magic");
    var magicText = "";

    for (var i = 0; i < Magic.length; i++) {
        magicText += "<button onclick=\"AddSpell('" + i + "')\" style=\"height:120px;width:280px;\"";
        if(Magic[i].cost > pGold || pMagics.indexOf(Magic[i]) != -1) magicText += " disabled";
        magicText += ">(" + Magic[i].type.toUpperCase().slice(0, 1) + Magic[i].type.substring(1) + ") " + Magic[i].name + " ("+ Magic[i].manaCost +" MP)<br>" + Magic[i].cost + " Gold<br>"+ Magic[i].desc +"</button>";
        if (i == 2 && Magic.length > 3) magicText += "<br>";
    }

    magicText += "<br><br><div class=\"center\"><button onclick=\"BackToMenu()\">Exit</button></div>"
    
    magicDisplay.innerHTML = magicText;
}

function AddSpell(spellNumber)
{
    pGold -= Magic[spellNumber].cost;
    pMagics[pMagics.length] = Magic[spellNumber];
    Receipt(Magic[spellNumber].name, Magic[spellNumber].cost, "Spell", "bought");
    ShowElementByID("shop");
    HideElementByID("shopmenu");
}

//#endregion

//#region Next Round Functions
function StartNextRound() {
    HideMenu();
    ShowFighting();

    var monster = ChooseMonster();

    DisplayMonster(monster, true);

    currentMonster = monster;

    UpdateBars();
    onMenu = false;
    fighting = true;
}

function ChooseMonster() {
    var typesPossible;
    if (round >= 100) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    else if (round >= 90) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    else if (round >= 80) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    else if (round >= 70) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    else if (round >= 60) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    else if (round >= 50) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    else if (round >= 40) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    else if (round >= 35) typesPossible = [1, 2, 3, 4, 5, 6, 7, 8];
    else if (round >= 30) typesPossible = [1, 2, 3, 4, 5, 6, 7];
    else if (round >= 25) typesPossible = [1, 2, 3, 4, 5, 6];
    else if (round >= 20) typesPossible = [1, 2, 3, 4, 5];
    else if (round >= 15) typesPossible = [1, 2, 3, 4];
    else if (round >= 10) typesPossible = [1, 2, 3];
    else if (round >= 5) typesPossible = [1, 2];
    else if (round >= 1) typesPossible = [1];

    var rng = Math.floor(Math.random() * 100) + 1;
    var monster;
    if (typesPossible.length == 1) monster = Monsters[0];
    else if (typesPossible.length == 2) {
        if (rng > 90) monster = Monsters[typesPossible[typesPossible.length - 1] - 1];
        else monster = Monsters[typesPossible[typesPossible.length - 2] - 1];
    }
    else if (typesPossible.length >= 3) {
        if (rng > 90) monster = Monsters[typesPossible[typesPossible.length - 1] - 1];
        else if (rng > 70) monster = Monsters[typesPossible[typesPossible.length - 2] - 1];
        else if (rng > 70 - (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 3] - 1];
        else if (rng > 70 - 2 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 4] - 1];
        else if (rng > 70 - 3 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 5] - 1];
        else if (rng > 70 - 4 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 6] - 1];
        else if (rng > 70 - 5 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 7] - 1];
        else if (rng > 70 - 6 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 8] - 1];
        else if (rng > 70 - 7 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 9] - 1];
        else if (rng > 70 - 8 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 10] - 1];
        else if (rng > 70 - 9 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 11] - 1];
        else if (rng > 70 - 10 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 12] - 1];
        else if (rng > 70 - 11 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 13] - 1];
        else if (rng > 70 - 12 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 14] - 1];
        else if (rng > 70 - 13 * (70.00 / (typesPossible.length - 2))) monster = Monsters[typesPossible[typesPossible.length - 15] - 1];
    }
    else monster = Monsters[0];

    monster.statusEffect = "none";
    monster.strength = monster.baseStrength;
    monster.speed = monster.baseSpeed;
    monster.nature = "none";

    rng = Math.floor(Math.random() * 1000) + 1;
    if (rng <= monster.specialChance) {
        monster.nature = "Shiny";
        monster.strength *= 2;
        monster.speed *= 2;
    }
    else 
    {
        rng = Math.floor(Math.random() * 6) + 1;
        switch (rng) {
            case 1:
                monster.nature = "Wild";
                break;
            case 2:
                monster.nature = "Powerful";
                monster.strength++;
                monster.speed++;
                break;
            case 3:
                monster.nature = "Shy";
                monster.speed--;
                monster.strength--;
                break;
            case 4:
                monster.nature = "Defensive";
                monster.strength++;
                break;
            case 5:
                monster.nature = "Hasty";
                monster.speed++;
                break;
            case 6:
                monster.nature = "Slow";
                monster.speed--;
                break;
        }
    }

    rng = Math.floor(Math.random() * 100) + 1;
    monster.maxHealth = monster.baseHealth;
    if (rng > 90) monster.maxHealth += Math.ceil(monster.maxHealth * 0.6);
    else if (rng > 80) monster.maxHealth += Math.ceil(monster.maxHealth * 0.5);
    else if (rng > 70) monster.maxHealth += Math.ceil(monster.maxHealth * 0.4);
    else if (rng > 60) monster.maxHealth += Math.ceil(monster.maxHealth * 0.3);
    else if (rng > 50) monster.maxHealth += Math.ceil(monster.maxHealth * 0.2);
    else if (rng > 40) monster.maxHealth += Math.ceil(monster.maxHealth * 0.1);
    //else if(rng > 30);
    else if (rng > 20) monster.maxHealth -= Math.ceil(monster.maxHealth * 0.1);
    else if (rng > 10) monster.maxHealth -= Math.ceil(monster.maxHealth * 0.2);
    else if (rng > 0) monster.maxHealth -= Math.ceil(monster.maxHealth * 0.3);

    monster.health = monster.maxHealth;

    return monster;
}
//#endregion

//#region Battle Info Updates
function DisplayDamage(playerFirst, mAD, pAD, aType, pCrit, mCrit) {
    var fightDisplay = document.getElementById("fightinfo");
    fightDisplay.innerHTML = "";

    var pCritText = "attacked";
    var mCritText = " attacked you ";

    if (pCrit) pCritText = "crit";
    if (!pCrit && aType == "Counter") pCritText = "failed to counter and did";

    if (mCrit) mCritText = " hit a critical attack ";

    var AttackText = "You readied yourself to strike";
    var DefendText = "You braced yourself for the next hit";
    var CounterText = "You prepared to counter the next attack";

    let lineBreak = "<br>";
    var mAttackText = "The " + currentMonster.name + mCritText + "and did " + mAD + " damage";
    if(currentMonster.newEffect) mAttackText += lineBreak + "You were "+ pStatus.toLowerCase();
    var pAttackText = "You " + pCritText + " with your " + pWeaponEquipped.name + " and did " + pAD + " damage";
    

    if (aType == "Attack") {
        fightDisplay.innerHTML += AttackText + lineBreak;
    }
    else if (aType == "Defend") {
        fightDisplay.innerHTML += DefendText + lineBreak;
    }
    else if (aType == "Counter") {
        fightDisplay.innerHTML += CounterText + lineBreak;
    }
    else if (aType == "Item") {
        var ItemText = "You used your " + pUseItem.name + " ";

        switch (pUseItem.type) {
            case "heal":
                ItemText += "and gained " + pUseItem.healed + "hp";
                break;
        }
        pAttackText = ItemText;
    }
    else if (aType == "Magic") {
        var MagicText = "You casted " + pUseSpell.name + " for " + pUseSpell.manaCost + " mana ";

        switch (pUseSpell.type) {
            case "heal":
                MagicText += "and gained " + pUseSpell.healed + "hp";
                break;
            case "damage":
                MagicText += "and it did " + pUseSpell.damage + " damage";
                break;
            case "status":
                MagicText += "and it did " + pUseSpell.damage + " damage";
                if(pUseSpell.newEffect) MagicText += lineBreak + "The " + currentMonster.name +" was "+ currentMonster.statusEffect.toLowerCase();
                break;
        }
        pAttackText = MagicText;
    }

    if (playerFirst || aType == "Item") {
        fightDisplay.innerHTML += pAttackText + lineBreak + mAttackText;
    }
    else {
        fightDisplay.innerHTML += mAttackText + lineBreak + pAttackText;
    }

}

function UpdateBars() {
    var pHealthPercent = Math.ceil((pHealth / pMaxHealth) * 100);
    document.getElementById("playerhealth").innerHTML = pHealthPercent + "%";
    document.getElementById("playerhealth").style.width = pHealthPercent + "%";
    var pManaPercent = Math.ceil((pMana / pMaxMana) * 100);
    document.getElementById("manacapacity").innerHTML = pMana + "MP";
    if (pMaxMana != 0) {
        document.getElementById("manacapacity").style.width = pManaPercent + "%";
    }
    else document.getElementById("manacapacity").style.width = "0%";
    var mHealthPercent = Math.ceil((currentMonster.health / currentMonster.maxHealth) * 100);
    document.getElementById("monsterhealth").innerHTML = mHealthPercent + "%";
    document.getElementById("monsterhealth").style.width = mHealthPercent + "%";
}

function DisplayMonster(mon, intro) {
    if (intro) {
        document.getElementById("intro").innerHTML = "A " + mon.nature + " " + mon.name + " Has Appeared<br>" + "Minimum Recommended Level: " + mon.minRecLevel;
        document.getElementById("fightinfo").innerHTML = "<br><br><br>";
        if (mon.special) { }
    }
    //if(Mon can be detected)
    document.getElementById("monsterinfo").innerHTML = "The " + mon.name + " Has " + mon.health + " Health Remaining<br>";
}
//#endregion

//#region Spells/Items
function OpenSpellInventory() {
    HideFighting();
    fighting = false;
    ShowElementByID("attackspells");

    var displayItems = "";
    for (var i = 0; i < pMagics.length; i++) {
        if (pMagics[i] != null) {
            displayItems += "<button onclick=\"UseSpell('" + pMagics[i].name + "')\" style=\"height:60px;width:140px;vertical-align:middle;\"";
            if(pMagics[i].manaCost > pMana) displayItems += " disabled";
            displayItems += ">" + pMagics[i].name + "</button>";
            if (i % 2 == 0 && i != 0) displayItems += "<br>";
        }
    }

    displayItems += "<br><br><div class=\"center\"><button onclick=\"BackToFighting()\" style=\"height:60px;width:140px;vertical-align:middle;\">Exit</button></div>";

    document.getElementById("attackspells").innerHTML = displayItems;
}

function UseSpell(spellName) {
    HideElementByID("attackspells");
    ShowFighting();
    fighting = true;

    for (var i = 0; i < pMagics.length; i++) {
        if (pMagics[i] != null && pMagics[i].name == spellName) {

            pUseSpell = pMagics[i];

            switch (pUseSpell.type) {
                case "heal":
                    pHealth += pUseSpell.heal;
                    pUseSpell.healed = pUseSpell.heal;
                    if(pHealth > pMaxHealth) pUseSpell.healed -= (pHealth - pMaxHealth);
                    pMana -= pUseSpell.manaCost;
                    break;
                case "damage":
                    currentMonster.health -= Math.round(pUseSpell.damage);
                    pMana -= pUseSpell.manaCost;
                    break;
                case "status":
                    currentMonster.health -= Math.round(pUseSpell.damage);
                    pMana -= pUseSpell.manaCost;
                    pUseSpell.newEffect = false;
                    
                    if (pUseSpell.effectChance < Math.floor(Math.random() * 10) + 1)
                    {
                        if(currentMonster.statusEffect != pUseSpell.statusEffect) 
                        {
                            currentMonster.statusEffect = pUseSpell.statusEffect;
                            pUseSpell.newEffect = true;
                        }
                    }
                    break;
            }

            if (pHealth > pMaxHealth) pHealth = pMaxHealth;
            Attack("Magic");
            pUseSpell = {};
            break;
        }

    }
}

function OpenAttackInventory() {
    HideFighting();
    fighting = false;
    ShowElementByID("fightinventory");

    var displayItems = "";
    for (var i = 0; i < pItems.length; i++) {
        if (pItems[i] != null) {
            displayItems += "<button onclick=\"UseItem('" + pItems[i].name + "')\" style=\"height:60px;width:140px;vertical-align:middle;\">" + pItems[i].name + "</button>";
            if (i % 4 == 0 && i != 0) displayItems += "<br>";
        }
    }

    displayItems += "<br><div class=\"center\"><button onclick=\"BackToFighting()\" style=\"height:60px;width:140px;vertical-align:middle;\">Exit</button></div>";

    document.getElementById("fightinventory").innerHTML = displayItems;
}

function UseItem(itemName) {
    HideElementByID("fightinventory");
    ShowFighting();
    fighting = true;

    for (var i = 0; i < pItems.length; i++) {
        if (pItems[i] != null && pItems[i].name == itemName) {
            pUseItem = pItems[i];

            switch (pUseItem.type) {
                case "heal":
                    pHealth += pUseItem.heal;
                    pUseItem.healed = pUseItem.heal;
                    if(pHealth > pMaxHealth) pUseItem.healed -= (pHealth - pMaxHealth);
                    break;
                case "mana":
                    pMana += pUseItem.mana;
                    break;
            }

            if (pHealth > pMaxHealth) pHealth = pMaxHealth;
            if (pMana > pMaxMana) pMana = pMaxMana;
            Attack("Item");
            pUseItem = {};
            pItems[i] = null;
            break;
        }

    }
}

function BackToFighting() {
    HideElementByID("fightinventory");
    HideElementByID("attackspells");
    ShowFighting();
    fighting = true;
}
//#endregion

//#region Battle Calculations
function Attack(type) {
    // Decide who goes first
    let pFirst;
    if ((SpeedCalculation() + Math.floor(Math.random() * 10) + 1) > currentMonster.speed + (Math.floor(Math.random() * 10) + 1)) {
        pFirst = true;
    }
    else {
        pFirst = false;
    }

    if(currentMonster.hitEffect != "none")
    {
        currentMonster.newEffect = false;
        if (currentMonster.effectChance < Math.floor(Math.random() * 10) + 1)
        {
            if(pStatus != currentMonster.hitEffect) 
            {
                pStatus = currentMonster.hitEffect;
                currentMonster.newEffect = true;
            }
        }
    }

    if (type == "Attack") {
        var mCriticalHit = MonsterCritCalculation(pFirst);
        var criticalHit;
        if (Math.floor(Math.random() * 100) + 1 == 50) criticalHit = true;
        else criticalHit = false;

        var mAttackDamage;
        mAttackDamage = (currentMonster.strength * 2) - Math.round(pArmorEquipped.defense * (1 + 0.1 * pToughness));
        if (mCriticalHit) mAttackDamage = mAttackDamage * 2;
        if (mAttackDamage < 0) mAttackDamage = 0;
        pHealth -= mAttackDamage;
        var pAttackDamage;
        pAttackDamage = Math.ceil(pWeaponEquipped.damage * (1 + 0.1 * (pStrength + 3)));
        if (criticalHit) pAttackDamage = pAttackDamage * 2;
        if (pAttackDamage < 0) pAttackDamage = 0;
        currentMonster.health -= pAttackDamage;

        DisplayDamage(pFirst, mAttackDamage, pAttackDamage, "Attack", criticalHit, mCriticalHit);
    }
    else if (type == "Defend") {
        var mCriticalHit = MonsterCritCalculation(pFirst);
        var criticalHit;
        if (Math.floor(Math.random() * 100) + 1 == 50) criticalHit = true;
        else criticalHit = false;

        var mAttackDamage;
        mAttackDamage = (currentMonster.strength * 2) - Math.round(pArmorEquipped.defense * (1 + 0.1 * (pToughness + 3)));
        if (mCriticalHit) mAttackDamage = mAttackDamage * 2;
        if (mAttackDamage < 0) mAttackDamage = 0;
        pHealth -= mAttackDamage;
        var pAttackDamage;
        pAttackDamage = Math.ceil(pWeaponEquipped.damage * (1 + 0.1 * pStrength));
        if (criticalHit) pAttackDamage = pAttackDamage * 2;
        if (pAttackDamage < 0) pAttackDamage = 0;
        currentMonster.health -= pAttackDamage;

        DisplayDamage(pFirst, mAttackDamage, pAttackDamage, "Defend", criticalHit, mCriticalHit);
    }
    else if (type == "Counter") {
        var mCriticalHit = MonsterCritCalculation(pFirst);
        var criticalHit;

        if (!pFirst) {
            if (Math.floor(Math.random() * 100) + 1 + Math.ceil((SpeedCalculation() * (Math.floor(Math.random() * 10) + 1)) / 10) > 80) criticalHit = true;
            else criticalhit = false;
        }
        else {
            if (Math.floor(Math.random() * 100) + 1 == 50) criticalHit = true;
            else criticalHit = false;
        }
        var mAttackDamage;
        mAttackDamage = (currentMonster.strength * 2) - Math.round(pArmorEquipped.defense * (1 + 0.1 * pToughness));
        if (mCriticalHit) mAttackDamage = mAttackDamage * 2;
        if (mAttackDamage < 0) mAttackDamage = 0;
        pHealth -= mAttackDamage;
        var pAttackDamage;
        pAttackDamage = Math.ceil(pWeaponEquipped.damage * (1 + 0.1 * pStrength));
        if (criticalHit) pAttackDamage = pAttackDamage * 2;
        else pAttackDamage = Math.floor(pAttackDamage * .75);
        if (pAttackDamage < 0) pAttackDamage = 0;
        currentMonster.health -= pAttackDamage;

        DisplayDamage(pFirst, mAttackDamage, pAttackDamage, "Counter", criticalHit, mCriticalHit);
    }
    else if (type == "Item") {
        var mCriticalHit = MonsterCritCalculation(true);
        var mAttackDamage;
        mAttackDamage = (currentMonster.strength * 2) - Math.round(pArmorEquipped.defense * (1 + 0.1 * pToughness));
        if (mAttackDamage < 0) mAttackDamage = 0;
        pHealth -= mAttackDamage;

        DisplayDamage(true, mAttackDamage, 0, "Item", false, mCriticalHit);
    }
    else if (type == "Magic") {
        var mCriticalHit = MonsterCritCalculation(true);
        var mAttackDamage;
        mAttackDamage = (currentMonster.strength * 2) - Math.round(pArmorEquipped.defense * (1 + 0.1 * pToughness));
        if (mAttackDamage < 0) mAttackDamage = 0;
        pHealth -= mAttackDamage;

        DisplayDamage(true, mAttackDamage, 0, "Magic", false, mCriticalHit);
    }

    if (currentMonster.statusEffect != "none") {
        var fightDisplay = document.getElementById("fightinfo");
        switch (currentMonster.statusEffect) {
            case "Burned":
                let burnDamage = Math.round(currentMonster.maxHealth / 16.0);
                currentMonster.health -= burnDamage;
                fightDisplay.innerHTML += "<br>The " + currentMonster.name + " took "+ burnDamage +" burn damage";
                break;
                case "Poisoned":
                let poisonDamage = Math.round(currentMonster.maxHealth / 16.0);
                currentMonster.health -= poisonDamage;
                fightDisplay.innerHTML += "<br>The " + currentMonster.name + " took "+ poisonDamage +" from poison";
                break;
        }
    }
    if (pStatus != "None") {
        var fightDisplay = document.getElementById("fightinfo");
        switch (pStatus) {
            case "Burned":
                let burnDamage = Math.round(pMaxHealth / 16.0);
                if (type == "Defend") burnDamage = Math.round(burnDamage / 2.0);
                pHealth -= burnDamage;
                fightDisplay.innerHTML += "<br>You took "+ burnDamage +" burn damage";
                break;
            case "Poisoned":
                let poisonDamage = Math.round(pMaxHealth / 16.0);
                if (type == "Defend") poisonDamage = Math.round(poisonDamage / 2.0);
                pHealth -= poisonDamage;
                fightDisplay.innerHTML += "<br>You took "+ poisonDamage +" from poison";
                break;
        }
    }

    UpdateBars();
    DisplayMonster(currentMonster, false);

    if (pFirst) {
        if (currentMonster.health <= 0) {
            AfterBattle(true);
            fighting = false;
            battleEnded = true;
            onResolution = true;
        }
        else if (pHealth <= 0) {
            AfterBattle(false);
            fighting = false;
        }
    }
    else {
        if (pHealth <= 0) {
            AfterBattle(false);
            fighting = false;
        }
        else if (currentMonster.health <= 0) {
            AfterBattle(true);
            fighting = false;
            battleEnded = true;
            onResolution = true;
        }
    }
}

function MonsterCritCalculation(playerFirst) {
    var mCriticalHit;

    if (playerFirst) {
        if (Math.floor(Math.random() * 100) + 1 + Math.ceil((currentMonster.speed * (Math.floor(Math.random() * 10) + 1)) / 10) > 95) mCriticalHit = true;
        else mCriticalHit = false;
    }
    else {
        if (Math.floor(Math.random() * 200) + 1 == 50) criticalHit = true;
        else mCriticalHit = false;
    }

    return mCriticalHit;
}

function SpeedCalculation() {
    var pSpeed = pWeaponEquipped.speed * (1 + Math.round(pAgility * 0.1));

    switch (pArmorEquipped.weight) {
        case "None":
            pSpeed = Math.round(pSpeed * 1.5);
            break;
        case "Light":
            pSpeed = Math.round(pSpeed * 1.25);
            break;
        case "Medium":
            pSpeed = Math.round(pSpeed * 1);
            break;
        case "Heavy":
            pSpeed = Math.round(pSpeed * 0.75);
            break;
        case "Very Heavy":
            pSpeed = Math.round(pSpeed * 0.5);
            break;
    }

    return pSpeed;
}
//#endregion

//#region After Battle Calculations
function AfterBattle(result) {
    HideFighting();
    ShowElementByID("resolution");

    if (result) {
        pHealth = pMaxHealth;
        pStatus = "None";
        var goldGained = CalcGoldGained(currentMonster.goldDrop);
        if(currentMonster.nature == "Shiny") goldGained *= 5;
        pGold += goldGained;
        var expGained = CalcEXPGained(currentMonster.minRecLevel, currentMonster.maxHealth);
        if(currentMonster.nature == "Shiny") expGained *= 2;
        pExp += expGained;

        document.getElementById("resolutiontext").innerHTML = "You have killed the " + currentMonster.name.toLowerCase() + "<br>You have gained " + goldGained + " gold and " + expGained + " experience";

        if (pExp >= Math.round(expToLvUp * (1 + (pLevel * 0.01)))) {
            pExp -= expToLvUp;
            LevelUp();
        }
        round++;
    }
    else {
        document.getElementById("resolutiontext").innerHTML = "YOU HAVE DIED<br>You Lasted Until Round " + round;
        document.getElementById("resolutiontext").style.color = "#cc0000";
        document.getElementById("resolutiontext").style.backgroundColor = "#333333";
        document.getElementById("resolutiontext").style.textAlign = "center";
        document.getElementById("resolutiontext").style.fontSize = "40pt";
        document.getElementById("resolutiontext").style.height = "200px";
        document.getElementById("resolutiontext").style.padding = "200px 0";
        document.getElementById("btnresolution").onclick = function Restart() 
        { 
            document.location.reload();
        };
    }
    currentMonster = null;
}

function CalcGoldGained(monGold) {
    var gold;
    var rng = Math.floor(Math.random() * 10) + 1;
    if (rng > 8) gold = Math.ceil(monGold * 1.2);
    else if (rng > 6) gold = Math.ceil(monGold * 1.1);
    else if (rng > 4) gold = monGold;
    else if (rng > 2) gold = Math.ceil(monGold * 0.9);
    else if (rng > 0) gold = Math.ceil(monGold * 0.8);

    return gold;
}

function CalcEXPGained(minlvl, health) {
    var xp = Math.ceil(((minlvl * 0.05) + 1) * (health * 4));
    if ((minlvl * 5) + 3 < round) {
        xp = Math.ceil(xp * (1 + (round - ((minlvl * 5) + 3)) * 0.02));
    }
    return xp;
}

function LevelUp() {
    pLevel++;
    var rng = Math.floor(Math.random() * 10) + 1;
    if (rng == 10)
    {
        pMaxMana += 5;
        pMana += 5;
    }

    switch (pLevel) {
        case 2:
            pStrength++;
            pToughness++;
            pAgility++;
            break;
        case 5:
            pStrength++;
            pToughness++;
            pAgility++;
            break;
        case 10:
            pStrength++;
            pToughness++;
            pAgility++;
            break;
        default:
            var rng = Math.floor(Math.random() * 10) + 1;
            if (rng > 9) {
                pStrength++;
                pToughness++;
                pAgility++;
            }
            else if (rng > 7) {
                pStrength++;
                pToughness++;
            }
            else if (rng > 5) {
                pToughness++;
                pAgility++;
            }
            else if (rng > 3) {
                pStrength++;
                pAgility++;
            }
            else if (rng == 3) {
                pStrength++;
            }
            else if (rng == 2) {
                pToughness++;
            }
            else if (rng == 1) {
                pAgility++;
            }
            break;
    }
}
//#endregion