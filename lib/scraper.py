from bs4 import BeautifulSoup
from html.parser import HTMLParser
import requests
import re
import json
import sys

game_obj = {
    "title": "",
    "airDate": "",
    "complete": False,
    "jeopardy": [],
    "doubleJeopardy": [],
    "finalJeopardy": {
        "category": "",
        "clue": "",
        "media": "",
        "response": "",
        },
    "plays": 0,
}

def get_soup(game_id):
    url = "https://j-archive.com/showgame.php?game_id=" + str(game_id)
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')
    thing = soup.find('p', {"class": "error"})
    try:
        thing.text
    except AttributeError:
        return soup
    else:
        return -1
    
def get_title(soup):
    ret = soup.find('div', {"id": "game_title"}).text
    title = ret.split(" - ")[0]
    airDate = ret.split(" - ")[1]
    return title, airDate

def get_clue_text(soup, id_info):
    return soup.findAll('td', {"class": "clue_text"}, id=re.compile(id_info))

def get_categories(soup):
    return soup.findAll('td', {"class": "category_name"})
    
def get_clue_header(soup):
    dd = [[],[],[],[],[],[]]
    djdd = [[],[],[],[],[],[]]
    headers = soup.findAll('td', {"class": "clue"})
    for head in headers:
        if("clue_J_1" in str(head)):
            if("DD:" in str(head)):
                dd[0].append(True)
            else:
                dd[0].append(False)
        if("clue_J_2" in str(head)):
            if("DD:" in str(head)):
                dd[1].append(True)
            else:
                dd[1].append(False)
        if("clue_J_3" in str(head)):
            if("DD:" in str(head)):
                dd[2].append(True)
            else:
                dd[2].append(False)
        if("clue_J_4" in str(head)):
            if("DD:" in str(head)):
                dd[3].append(True)
            else:
                dd[3].append(False)
        if("clue_J_5" in str(head)):
            if("DD:" in str(head)):
                dd[4].append(True)
            else:
                dd[4].append(False)
        if("clue_J_6" in str(head)):
            if("DD:" in str(head)):
                dd[5].append(True)
            else:
                dd[5].append(False)

        if("clue_DJ_1" in str(head)):
            if("DD:" in str(head)):
                djdd[0].append(True)
            else:
                djdd[0].append(False)
        if("clue_DJ_2" in str(head)):
            if("DD:" in str(head)):
                djdd[1].append(True)
            else:
                djdd[1].append(False)
        if("clue_DJ_3" in str(head)):
            if("DD:" in str(head)):
                djdd[2].append(True)
            else:
                djdd[2].append(False)
        if("clue_DJ_4" in str(head)):
            if("DD:" in str(head)):
                djdd[3].append(True)
            else:
                djdd[3].append(False)
        if("clue_DJ_5" in str(head)):
            if("DD:" in str(head)):
                djdd[4].append(True)
            else:
                djdd[4].append(False)
        if("clue_DJ_6" in str(head)):
            if("DD:" in str(head)):
                djdd[5].append(True)
            else:
                djdd[5].append(False)
    return dd, djdd
        
def separate_and_order_clues(clues):
    ret_clues = [[],[],[],[],[],[]]
    ret_media = [[],[],[],[],[],[]]
    ret_questions = [[],[],[],[],[],[]]
    for clue in clues:
        if("_r" in str(clue)):
            if("J_1_" in str(clue)):
                ret_questions[0].append(f"What is {clue.find("em").text}?")
            if("J_2_" in str(clue)):
                ret_questions[1].append(f"What is {clue.find("em").text}?")
            if("J_3_" in str(clue)):
                ret_questions[2].append(f"What is {clue.find("em").text}?")
            if("J_4_" in str(clue)):
                ret_questions[3].append(f"What is {clue.find("em").text}?")
            if("J_5_" in str(clue)):
                ret_questions[4].append(f"What is {clue.find("em").text}?")
            if("J_6_" in str(clue)):
                ret_questions[5].append(f"What is {clue.find("em").text}?")
        else:
            if("J_1_" in str(clue)):
                if(clue.find("a")):
                    ret_media[0].append(clue.find("a")["href"])
                else:
                    ret_media[0].append("")
                ret_clues[0].append(clue.text)
            if("J_2_" in str(clue)):
                if(clue.find("a")):
                    ret_media[1].append(clue.find("a")["href"])
                else:
                    ret_media[1].append("")
                ret_clues[1].append(clue.text)
            if("J_3_" in str(clue)):
                if(clue.find("a")):
                    ret_media[2].append(clue.find("a")["href"])
                else:
                    ret_media[2].append("")
                ret_clues[2].append(clue.text)
            if("J_4_" in str(clue)):
                if(clue.find("a")):
                    ret_media[3].append(clue.find("a")["href"])
                else:
                    ret_media[3].append("")
                ret_clues[3].append(clue.text)
            if("J_5_" in str(clue)):
                if(clue.find("a")):
                    ret_media[4].append(clue.find("a")["href"])
                else:
                    ret_media[4].append("")
                ret_clues[4].append(clue.text)
            if("J_6_" in str(clue)):
                if(clue.find("a")):
                    ret_media[5].append(clue.find("a")["href"])
                else:
                    ret_media[5].append("")
                ret_clues[5].append(clue.text)
    return ret_clues, ret_media, ret_questions

def set_clue_arr(clues, media, question, dd, mult):
    clue_arr = [[],[],[],[],[],[]]
    for i in range(0, 6):
        for j in range(0, 5):
            clue_arr[i].append({
                "value": (j+1)*mult,
                "clue": clues[i][j],
                "media": media[i][j],
                "response": question[i][j],
                "double": dd[i][j]
            } if len(clues[i]) > j else {
                "value": (j+1)*mult,
                "clue": "",
                "media": "",
                "response": "",
                "double": False
            })
    return clue_arr

def verifyFullGame(obj):
    for cat in obj["jeopardy"]:
        for clue in cat["clues"]:
            if(clue["clue"] == ""):
                return False
    for cat in obj["doubleJeopardy"]:
        for clue in cat["clues"]:
            if(clue["clue"] == ""):
                return False
    return True

def print_out_game(obj):
    print(json.dumps(obj))

def write_game_to_file(game_obj):
    write_to_file = json.dumps(game_obj, indent=2)
    with open(f"{game_obj["title"]}.json", "w") as outfile:
        outfile.write(write_to_file)

if __name__ == "__main__":
  game_id = sys.argv[1]
  soup = get_soup(game_id)
  if(soup == -1):
      print("Game not found")
      exit()

  title, airdate = get_title(soup)
  categories = get_categories(soup)
  single_dd, double_dd = get_clue_header(soup)
  single_clues = get_clue_text(soup, "^clue_J_")
  double_clues = get_clue_text(soup, "^clue_DJ_")
  final_clue = get_clue_text(soup, "^clue_FJ")

  single_clues, single_media, single_question = separate_and_order_clues(single_clues)
  double_clues, double_media, double_question = separate_and_order_clues(double_clues)

  single_clue_arr = set_clue_arr(single_clues, single_media, single_question, single_dd, 200)
  double_clue_arr = set_clue_arr(double_clues, double_media, double_question, double_dd, 400)

  game_obj["title"] = title
  game_obj["airDate"] = airdate
  for i in range(0, 6):
      game_obj["jeopardy"].append({
          "category": categories[i].text,
          "clues": single_clue_arr[i]
      })
      game_obj["doubleJeopardy"].append({
          "category": categories[i+6].text,
          "clues": double_clue_arr[i]
      })

  game_obj["finalJeopardy"] = {
      "category": categories[-1].text,
      "clue": {
          "answer": final_clue[0].text,
          "question": f"What is {final_clue[1].find("em").text}?"
      }
  }

  game_obj["complete"] = verifyFullGame(game_obj)

  print_out_game(game_obj)
  # write_game_to_file(game_obj)
