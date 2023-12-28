import re
from urllib import parse
from typing import Any

parse_query_brackets_query = re.compile(r"(\[([^\]]*)\])")

def parse_query(payload: Any, ignore: list[str] = []):
    data = {}
    query = parse.parse_qs( str(payload) )

    def parse_level( key, value, data ):

        if '[' in key:
            level_key, nested_key = key.split('[', 1) # `level_key[nested_key...`
            nested_key = ''.join( nested_key.split(']', 1) )

            if level_key in ignore:
                return data

            if level_key.startswith("'") or level_key.startswith('"'):
                level_key = level_key[1:]

            if level_key.endswith("'") or level_key.endswith('"'):
                level_key = level_key[:-1]

            if level_key not in data:
                if nested_key == '':
                    data[level_key] = []
                else:
                    data[level_key] = {}

            if '[' in nested_key:
                data[level_key] = parse_level( nested_key, value, data[level_key] )
            else:
                if nested_key == '':
                    data[level_key] = value
                else:
                    data[level_key][nested_key] = value

        else:

            if key in ignore:
                return data

            if type(value) == list:
                data[key] = value[0]
            else:
                data[key] = value

        return data


    for key in query:
        value = query[key]
        data = parse_level( key, value, data )

    return data